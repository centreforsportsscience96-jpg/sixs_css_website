import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StaffSection from '../components/StaffSection';
import AdminPage from '../pages/admin/AdminPage';

const mockState = vi.hoisted(() => ({
  staffRows: [],
  noticesRows: [],
  enquiriesRows: [],
  insertStaffSpy: vi.fn(),
  updateStaffSpy: vi.fn(),
  deleteStaffSpy: vi.fn(),
  uploadSpy: vi.fn(),
  removeStorageSpy: vi.fn(),
  isAdmin: false,
  session: null,
}));

vi.mock('../lib/supabase', () => {
  const createStaffQueryBuilder = () => {
    const secondOrder = () =>
      Promise.resolve({ data: [...mockState.staffRows], error: null });
    const firstOrder = () => ({ order: secondOrder });

    return {
      select: () => ({ order: firstOrder }),
      insert: (rows) => {
        mockState.insertStaffSpy(rows);
        const created = rows.map((row, idx) => ({
          id: Date.now() + idx,
          created_at: new Date().toISOString(),
          ...row,
        }));
        mockState.staffRows = [...mockState.staffRows, ...created];
        return Promise.resolve({ data: created, error: null });
      },
      update: (payload) => ({
        eq: (_col, id) => {
          mockState.updateStaffSpy(id, payload);
          mockState.staffRows = mockState.staffRows.map((item) =>
            item.id === id ? { ...item, ...payload } : item
          );
          return Promise.resolve({ data: null, error: null });
        },
      }),
      delete: () => ({
        eq: (_col, id) => {
          mockState.deleteStaffSpy(id);
          mockState.staffRows = mockState.staffRows.filter((item) => item.id !== id);
          return Promise.resolve({ data: null, error: null });
        },
      }),
    };
  };

  return {
    supabase: {
      auth: {
        getSession: () => Promise.resolve({ data: { session: mockState.session } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signOut: vi.fn(() => Promise.resolve()),
      },
      rpc: (fnName) => {
        if (fnName === 'is_admin') {
          return Promise.resolve({ data: mockState.isAdmin, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      },
      from: (table) => {
        if (table === 'staff_members') {
          return createStaffQueryBuilder();
        }
        if (table === 'center_notices') {
          return {
            select: () => ({
              order: () => Promise.resolve({ data: [...mockState.noticesRows], error: null }),
            }),
          };
        }
        if (table === 'enquiries') {
          return {
            select: () => ({
              order: () => Promise.resolve({ data: [...mockState.enquiriesRows], error: null }),
            }),
          };
        }
        return createStaffQueryBuilder();
      },
      storage: {
        from: (bucket) => ({
          upload: (path, file) => {
            mockState.uploadSpy(bucket, path, file);
            return Promise.resolve({ data: { path }, error: null });
          },
          getPublicUrl: (path) => ({
            data: {
              publicUrl: `https://example.supabase.co/storage/v1/object/public/${bucket}/${path}`,
            },
          }),
          remove: (paths) => {
            mockState.removeStorageSpy(bucket, paths);
            return Promise.resolve({ data: paths, error: null });
          },
        }),
      },
    },
  };
});

describe('StaffSection & Admin Staff Management', () => {
  beforeEach(() => {
    mockState.staffRows = [];
    mockState.noticesRows = [];
    mockState.enquiriesRows = [];
    mockState.isAdmin = false;
    mockState.session = null;
    mockState.insertStaffSpy.mockClear();
    mockState.updateStaffSpy.mockClear();
    mockState.deleteStaffSpy.mockClear();
    mockState.uploadSpy.mockClear();
    mockState.removeStorageSpy.mockClear();
  });

  it('renders fallback empty state when no staff members exist', async () => {
    render(
      <BrowserRouter>
        <StaffSection />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Team Roster Coming Soon/i)).toBeInTheDocument();
  });

  it('renders staff cards with photo, name, designation, and full bio modal', async () => {
    const longBio =
      'Former national athletics physiotherapist specializing in ACL rehabilitation, gait biomechanics, and return-to-sport reconditioning for track and field athletes across Bangalore and Karnataka.';

    mockState.staffRows = [
      {
        id: 101,
        name: 'Dr. Meera Krishnan',
        designation: 'Head of Sports Physiotherapy',
        department: 'Sports Physiotherapy',
        bio: longBio,
        photo_url: 'https://example.supabase.co/storage/v1/object/public/staff-photos/profiles/meera.jpg',
        display_order: 1,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 102,
        name: 'Rohan Deshmukh',
        designation: 'Performance Dietitian',
        department: 'Sports Nutrition',
        bio: 'Specializes in endurance fueling and recovery nutrition.',
        photo_url: null,
        display_order: 2,
        created_at: '2026-01-02T00:00:00.000Z',
      },
    ];

    render(
      <BrowserRouter>
        <StaffSection />
      </BrowserRouter>
    );

    expect(await screen.findByText('Dr. Meera Krishnan')).toBeInTheDocument();
    expect(screen.getByText('Head of Sports Physiotherapy')).toBeInTheDocument();
    expect(screen.getByText('Sports Physiotherapy')).toBeInTheDocument();
    expect(screen.getByAltText(/Dr. Meera Krishnan/i)).toHaveAttribute(
      'src',
      mockState.staffRows[0].photo_url
    );

    const gridEl = screen.getByText('Dr. Meera Krishnan').closest('.staff-grid');
    expect(gridEl).toHaveClass('staff-grid-two');

    // Filter by department subsection (switches to centered single-card layout)
    fireEvent.click(screen.getByRole('tab', { name: /Sports Nutrition \(1\)/i }));
    expect(screen.queryByText('Dr. Meera Krishnan')).not.toBeInTheDocument();
    expect(screen.getByText('Rohan Deshmukh')).toBeInTheDocument();
    expect(screen.getByText('Rohan Deshmukh').closest('.staff-grid')).toHaveClass('staff-grid-single');

    fireEvent.click(screen.getByRole('tab', { name: /All Specialists \(2\)/i }));
    expect(screen.getByText('Dr. Meera Krishnan')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Read Full Bio/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Sports Physiotherapy');
    expect(screen.getByRole('link', { name: /Book an Assessment/i })).toHaveAttribute(
      'href',
      '/contact'
    );

    fireEvent.click(screen.getByRole('button', { name: /Close biography modal/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('allows an admin to add, edit, and delete staff members in AdminPage', async () => {
    mockState.isAdmin = true;
    mockState.session = { user: { id: 'admin-1', email: 'admin@css.test' } };

    render(
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    );

    const staffTabBtn = await screen.findByRole('button', { name: /Staff Team/i });
    fireEvent.click(staffTabBtn);

    fireEvent.click(screen.getByRole('button', { name: /\+ Add Staff Member/i }));

    const deptSelect = screen.getByLabelText(/Department \/ Unit/i);
    expect(screen.getByRole('option', { name: 'Sports Physiotherapy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Strength & Conditioning' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Sports Biomechanics' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Administration' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'IT Support' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /\+ Add New Role \/ Department/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Coach Vikram Rao' },
    });
    fireEvent.change(screen.getByLabelText(/Designation/i), {
      target: { value: 'Strength & Conditioning Specialist' },
    });
    fireEvent.change(deptSelect, {
      target: { value: 'Strength & Conditioning' },
    });
    fireEvent.change(screen.getByLabelText(/Biographical Information/i), {
      target: { value: 'CSCS certified performance coach focusing on sprint mechanics.' },
    });

    const photoFile = new File(['avatar-bytes'], 'vikram.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Staff Photo/i), {
      target: { files: [photoFile] },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Add Staff Member$/i }));

    await waitFor(() => {
      expect(mockState.uploadSpy).toHaveBeenCalledWith(
        'staff-photos',
        expect.stringContaining('profiles/'),
        photoFile
      );
      expect(mockState.insertStaffSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Coach Vikram Rao',
          department: 'Strength & Conditioning',
        }),
      ]);
    });

    expect(await screen.findByText('Coach Vikram Rao')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Edit$/i }));
    fireEvent.change(screen.getByLabelText(/Designation/i), {
      target: { value: 'Lead S&C Coach' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Update Staff Member/i }));

    await waitFor(() => {
      expect(mockState.updateStaffSpy).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({ designation: 'Lead S&C Coach' })
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /^Delete$/i }));
    fireEvent.click(screen.getByRole('button', { name: /Yes, Delete/i }));

    await waitFor(() => {
      expect(mockState.deleteStaffSpy).toHaveBeenCalledTimes(1);
      expect(mockState.removeStorageSpy).toHaveBeenCalledWith('staff-photos', [
        expect.stringContaining('profiles/'),
      ]);
    });
  });

  it('allows an admin to add a staff member with a custom role/department', async () => {
    mockState.isAdmin = true;
    mockState.session = { user: { id: 'admin-1', email: 'admin@css.test' } };

    render(
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /Staff Team/i }));
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Staff Member/i }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Ananya Menon' },
    });
    fireEvent.change(screen.getByLabelText(/Designation/i), {
      target: { value: 'Lead Sports Nutritionist' },
    });
    fireEvent.change(screen.getByLabelText(/Department \/ Unit/i), {
      target: { value: '__custom__' },
    });
    fireEvent.change(screen.getByLabelText(/New Role or Department/i), {
      target: { value: 'Sports Nutrition' },
    });
    fireEvent.change(screen.getByLabelText(/Biographical Information/i), {
      target: { value: 'Performance fueling specialist.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Add Staff Member$/i }));

    await waitFor(() => {
      expect(mockState.insertStaffSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Ananya Menon',
          department: 'Sports Nutrition',
        }),
      ]);
    });

    // Newly added custom department remains selectable for future staff members
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Staff Member/i }));
    expect(await screen.findByRole('option', { name: 'Sports Nutrition' })).toBeInTheDocument();
  });
});

