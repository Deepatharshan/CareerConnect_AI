import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCompanyByOwner, updateCompany, uploadCompanyLogo, API_BASE_URL } from '../api';
import { Building2, Save, Upload, Plus, Trash2, CheckCircle, X } from 'lucide-react';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [company, setCompany] = useState({
    id: '',
    ownerId: user?.userId || '',
    name: '',
    description: '',
    website: '',
    logoUrl: '',
    industry: '',
    location: '',
    phone: '',
    email: '',
    ceoName: '',
    hrName: '',
    branches: '[]',
    staffNames: '[]',
    socialMediaLinks: '[]'
  });

  const [branchesList, setBranchesList] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [socialList, setSocialList] = useState<string[]>([]);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const data = await getCompanyByOwner(user!.userId, user!.token);
      if (data) {
        setCompany(data);
        try { setBranchesList(JSON.parse(data.branches || '[]')); } catch { setBranchesList([]); }
        try { setStaffList(JSON.parse(data.staffNames || '[]')); } catch { setStaffList([]); }
        try { setSocialList(JSON.parse(data.socialMediaLinks || '[]')); } catch { setSocialList([]); }
      }
    } catch (err) {
      // It's okay if not found, they will create one
      console.log('No company profile yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompany(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleListChange = (setter: any, index: number, value: string) => {
    setter((prev: string[]) => {
      const newList = [...prev];
      newList[index] = value;
      return newList;
    });
  };

  const handleAddList = (setter: any) => {
    setter((prev: string[]) => [...prev, '']);
  };

  const handleRemoveList = (setter: any, index: number) => {
    setter((prev: string[]) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      let finalLogoUrl = company.logoUrl;
      if (logoFile) {
        finalLogoUrl = await uploadCompanyLogo(logoFile, user!.token);
      }
      
      const payload = {
        ...company,
        logoUrl: finalLogoUrl,
        ownerId: user?.userId,
        branches: JSON.stringify(branchesList),
        staffNames: JSON.stringify(staffList),
        socialMediaLinks: JSON.stringify(socialList)
      };

      await updateCompany(payload, user!.token);
      setSuccess('Company Profile updated successfully!');
      fetchCompany();
    } catch (err) {
      setError('Failed to save company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="glass-card rounded-3xl border border-white/10 shadow-sm overflow-hidden mb-10">
      <div className="bg-gradient-to-r from-surface-container to-surface p-8 text-on-surface relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center p-2 shadow-lg overflow-hidden shrink-0 border-4 border-white/10">
            {(logoFile ? URL.createObjectURL(logoFile) : company.logoUrl) ? (
              <img src={logoFile ? URL.createObjectURL(logoFile) : (company.logoUrl.startsWith('http') ? company.logoUrl : `${API_BASE_URL.replace('/api/v1', '')}${company.logoUrl}`)} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-10 h-10 text-on-surface-variant/30" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{company.name || 'Setup Company Profile'}</h2>
            <p className="text-on-surface-variant mt-1">Complete your profile to post jobs on behalf of this company.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        {success && (
          <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/20 text-green-400 rounded-2xl px-5 py-4">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{success}</p>
            <button type="button" onClick={() => setSuccess('')} className="ml-auto text-green-400/60 hover:text-green-400"><X className="w-4 h-4" /></button>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-error/10 border border-error/20 text-error rounded-2xl px-5 py-4">
            <X className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-on-surface border-b border-white/10 pb-2">Basic Info</h3>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant block mb-1">Company Name</label>
              <input name="name" value={company.name} onChange={handleChange} required className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant block mb-1">Industry</label>
              <input name="industry" value={company.industry} onChange={handleChange} required className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Technology, Healthcare" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant block mb-1">About Company</label>
              <textarea name="description" value={company.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary resize-none transition-colors" placeholder="What does your company do?" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant block mb-1">Company Logo</label>
              <div className="flex items-center gap-4">
                <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <label htmlFor="logoUpload" className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl font-medium transition-colors">
                  <Upload className="w-4 h-4" /> Upload Image
                </label>
                <span className="text-sm text-on-surface-variant">{logoFile?.name || (company.logoUrl ? 'Logo already uploaded' : 'No file chosen')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-on-surface border-b border-white/10 pb-2">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-1">Email</label>
                <input name="email" value={company.email} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="hello@company.com" />
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-1">Phone</label>
                <input name="phone" value={company.phone} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="+1 234 567 890" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant block mb-1">Website</label>
              <input name="website" value={company.website} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="https://www.company.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant block mb-1">Headquarters Location</label>
              <input name="location" value={company.location} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="e.g. San Francisco, CA" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-on-surface border-b border-white/10 pb-2">Leadership & Team</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-1">CEO Name</label>
                <input name="ceoName" value={company.ceoName} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="CEO Name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant block mb-1">HR Head Name</label>
                <input name="hrName" value={company.hrName} onChange={handleChange} className="w-full px-4 py-3 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary transition-colors" placeholder="HR Manager" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between mb-2">
                Key Staff Members
                <button type="button" onClick={() => handleAddList(setStaffList)} className="text-primary hover:text-primary-fixed text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Add Staff</button>
              </label>
              {staffList.map((staff, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={staff} onChange={(e) => handleListChange(setStaffList, idx, e.target.value)} className="flex-1 px-4 py-2 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary text-sm transition-colors" placeholder="e.g. John Doe - CTO" />
                  <button type="button" onClick={() => handleRemoveList(setStaffList, idx)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {staffList.length === 0 && <p className="text-xs text-on-surface-variant/50 italic">No staff members added.</p>}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-on-surface border-b border-white/10 pb-2">Branches & Socials</h3>
            <div>
              <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between mb-2">
                Company Branches
                <button type="button" onClick={() => handleAddList(setBranchesList)} className="text-primary hover:text-primary-fixed text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Add Branch</button>
              </label>
              {branchesList.map((branch, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={branch} onChange={(e) => handleListChange(setBranchesList, idx, e.target.value)} className="flex-1 px-4 py-2 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary text-sm transition-colors" placeholder="e.g. London Office" />
                  <button type="button" onClick={() => handleRemoveList(setBranchesList, idx)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {branchesList.length === 0 && <p className="text-xs text-on-surface-variant/50 italic">No branches added.</p>}
            </div>
            
            <div>
              <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between mb-2">
                Social Media Links
                <button type="button" onClick={() => handleAddList(setSocialList)} className="text-primary hover:text-primary-fixed text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Add Link</button>
              </label>
              {socialList.map((social, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input value={social} onChange={(e) => handleListChange(setSocialList, idx, e.target.value)} className="flex-1 px-4 py-2 bg-surface border border-white/10 text-on-surface rounded-xl focus:outline-none focus:border-primary text-sm transition-colors" placeholder="e.g. https://linkedin.com/company/..." />
                  <button type="button" onClick={() => handleRemoveList(setSocialList, idx)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {socialList.length === 0 && <p className="text-xs text-on-surface-variant/50 italic">No social media links added.</p>}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:scale-105 text-on-primary rounded-xl font-bold transition-transform duration-300 disabled:opacity-70 hover:shadow-[0_0_15px_rgba(137,206,255,0.4)]">
            {saving ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving Profile...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
