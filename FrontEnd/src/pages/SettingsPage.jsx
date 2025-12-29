import { useState } from 'react';
import { Save, Bell, Lock, User, Globe, Mail, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'LuxeHome Furniture',
    siteEmail: 'admin@luxehome.com',
    sitePhone: '+1 234 567 890',
    currency: 'USD',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerMessages: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    // Save logic here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your system configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card title="General Settings">
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
            />
            <Input
              label="Site Email"
              type="email"
              value={generalSettings.siteEmail}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteEmail: e.target.value })}
            />
            <Input
              label="Site Phone"
              value={generalSettings.sitePhone}
              onChange={(e) => setGeneralSettings({ ...generalSettings, sitePhone: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={generalSettings.currency}
                onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="BDT">BDT - Bangladeshi Taka</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <Card title="Notification Preferences">
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Card title="Security Settings">
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={securitySettings.currentPassword}
              onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
            />
            <Input
              label="New Password"
              type="password"
              value={securitySettings.newPassword}
              onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={securitySettings.confirmPassword}
              onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
            />
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-amber-900">Password Requirements</h4>
                  <ul className="text-sm text-amber-800 mt-2 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card title="Profile Information">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-amber-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.name || 'Admin User'}</h3>
                <p className="text-gray-600">{user?.email || 'admin@luxehome.com'}</p>
                <Button variant="secondary" className="mt-2">Change Avatar</Button>
              </div>
            </div>
            <Input
              label="Full Name"
              value={user?.name || ''}
              disabled
            />
            <Input
              label="Email Address"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <Input
              label="Role"
              value={user?.role || 'admin'}
              disabled
            />
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center text-green-600 font-medium">
            <span>✓ Settings saved successfully</span>
          </div>
        )}
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default SettingsPage;
