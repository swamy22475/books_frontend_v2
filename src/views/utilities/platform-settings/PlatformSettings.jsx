import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from
    'src/components/ui/select';
import { Switch } from 'src/components/ui/switch';
import { Icon } from '@iconify/react';
import { api } from 'src/lib/api-client';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Platform Settings' }];


const PlatformSettings = () => {
    const [formData, setFormData] = useState({
        siteName: 'Mindwhile School ERP',
        footerText: 'School ERP',
        defaultCurrency: 'inr',
        paymentMode: 'sandbox',
        mailHost: '',
        mailPort: '587',
        mailUsername: '',
        mailPassword: '',
        mailEncryption: 'tls',
        mailFromAddress: '',
        mailFromName: 'Mindwhile School ERP',
        enableOtp: false,
        masterOtp: ''
    });

    const [siteLogo, setSiteLogo] = useState(null);
    const [favicon, setFavicon] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/master/platform-settings/');
                if (response) {
                    setFormData({
                        siteName: response.site_name || '',
                        footerText: response.footer_text || '',
                        defaultCurrency: response.default_currency || 'inr',
                        paymentMode: response.payment_mode || 'sandbox',
                        mailHost: response.mail_host || '',
                        mailPort: response.mail_port || '587',
                        mailUsername: response.mail_username || '',
                        mailPassword: response.mail_password || '',
                        mailEncryption: response.mail_encryption || 'tls',
                        mailFromAddress: response.mail_from_address || '',
                        mailFromName: response.mail_from_name || '',
                        enableOtp: response.enable_otp || false,
                        masterOtp: response.master_otp || ''
                    });
                }
            } catch (err) {
                console.error('Failed to fetch platform settings:', err);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (siteLogo) data.append('site_logo', siteLogo);
            if (favicon) data.append('favicon', favicon);

            await api.put('/master/platform-settings/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Settings saved successfully!");
        } catch (err) {
            console.error("Failed to save settings:", err);
            alert("Failed to save settings. Please try again.");
        }
    };

    return (
        <>
            <BreadcrumbComp title="Platform Settings" items={BCrumb} />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-6">
                    {/* ============ LEFT COLUMN — FORM ============ */}
                    <div className="lg:col-span-8 col-span-12 flex flex-col gap-6">

                        {/* ── Section 1: General & Branding ── */}
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="border-b border-border bg-muted/30 px-6 py-3">
                                <h5 className="font-semibold text-base flex items-center gap-2">
                                    <Icon icon="solar:palette-round-linear" width={20} />
                                    General &amp; Branding
                                </h5>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div>
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input
                                        id="siteName"
                                        value={formData.siteName}
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className="mt-2"
                                        placeholder="Enter your platform name" />

                                </div>

                                <div>
                                    <Label htmlFor="footerText">Footer Text</Label>
                                    <Input
                                        id="footerText"
                                        value={formData.footerText}
                                        onChange={(e) => handleChange('footerText', e.target.value)}
                                        className="mt-2"
                                        placeholder="Text shown in the footer" />

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Label htmlFor="siteLogo">Site Logo (PNG, JPG)</Label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <div className="h-14 w-14 rounded-lg border border-dashed border-border flex items-center justify-center bg-muted/20 shrink-0">
                                                {siteLogo ?
                                                    <img
                                                        src={URL.createObjectURL(siteLogo)}
                                                        alt="Logo preview"
                                                        className="h-full w-full object-contain rounded-lg" /> :


                                                    <Icon icon="solar:image-linear" width={24} className="text-muted-foreground" />
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    id="siteLogo"
                                                    type="file"
                                                    accept=".png,.jpg,.jpeg"
                                                    onChange={(e) => setSiteLogo(e.target.files?.[0] || null)}
                                                    className="text-sm" />

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="favicon">Site Favicon (.ico, .png)</Label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <div className="h-14 w-14 rounded-lg border border-dashed border-border flex items-center justify-center bg-muted/20 shrink-0">
                                                {favicon ?
                                                    <img
                                                        src={URL.createObjectURL(favicon)}
                                                        alt="Favicon preview"
                                                        className="h-full w-full object-contain rounded-lg" /> :


                                                    <Icon icon="solar:star-linear" width={24} className="text-muted-foreground" />
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    id="favicon"
                                                    type="file"
                                                    accept=".ico,.png"
                                                    onChange={(e) => setFavicon(e.target.files?.[0] || null)}
                                                    className="text-sm" />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Section 2: Subscription Payment Settings ── */}
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="border-b border-border bg-muted/30 px-6 py-3">
                                <h5 className="font-semibold text-base flex items-center gap-2">
                                    <Icon icon="solar:card-linear" width={20} />
                                    Subscription Payment Settings
                                </h5>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div>
                                    <Label htmlFor="defaultCurrency">Default Currency for Subscriptions</Label>
                                    <Select
                                        value={formData.defaultCurrency}
                                        onValueChange={(val) => handleChange('defaultCurrency', val)}>

                                        <SelectTrigger className="mt-2 w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                                            <SelectItem value="usd">US Dollar ($)</SelectItem>
                                            <SelectItem value="eur">Euro (€)</SelectItem>
                                            <SelectItem value="gbp">British Pound (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="paymentMode">Platform Payment Mode</Label>
                                    <Select
                                        value={formData.paymentMode}
                                        onValueChange={(val) => handleChange('paymentMode', val)}>

                                        <SelectTrigger className="mt-2 w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sandbox">Sandbox (Test Mode)</SelectItem>
                                            <SelectItem value="live">Live (Production)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* ── Section 3: Mail (SMTP) Settings ── */}
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="border-b border-border bg-muted/30 px-6 py-3">
                                <h5 className="font-semibold text-base flex items-center gap-2">
                                    <Icon icon="solar:letter-linear" width={20} />
                                    Mail (SMTP) Settings
                                </h5>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <p className="text-sm text-muted-foreground -mt-1">
                                    These settings will override the values in your main .env file.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Label htmlFor="mailHost">Mail Host</Label>
                                        <Input
                                            id="mailHost"
                                            value={formData.mailHost}
                                            onChange={(e) => handleChange('mailHost', e.target.value)}
                                            className="mt-2"
                                            placeholder="smtp.example.com" />

                                    </div>
                                    <div>
                                        <Label htmlFor="mailPort">Mail Port</Label>
                                        <Input
                                            id="mailPort"
                                            value={formData.mailPort}
                                            onChange={(e) => handleChange('mailPort', e.target.value)}
                                            className="mt-2"
                                            placeholder="587" />

                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Label htmlFor="mailUsername">Mail Username</Label>
                                        <Input
                                            id="mailUsername"
                                            value={formData.mailUsername}
                                            onChange={(e) => handleChange('mailUsername', e.target.value)}
                                            className="mt-2"
                                            placeholder="your@email.com" />

                                    </div>
                                    <div>
                                        <Label htmlFor="mailPassword">Mail Password</Label>
                                        <Input
                                            id="mailPassword"
                                            type="password"
                                            value={formData.mailPassword}
                                            onChange={(e) => handleChange('mailPassword', e.target.value)}
                                            className="mt-2"
                                            placeholder="••••••••" />

                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="mailEncryption">Mail Encryption</Label>
                                    <Select
                                        value={formData.mailEncryption}
                                        onValueChange={(val) => handleChange('mailEncryption', val)}>

                                        <SelectTrigger className="mt-2 w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tls">TLS</SelectItem>
                                            <SelectItem value="ssl">SSL</SelectItem>
                                            <SelectItem value="none">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Label htmlFor="mailFromAddress">Mail From Address</Label>
                                        <Input
                                            id="mailFromAddress"
                                            type="email"
                                            value={formData.mailFromAddress}
                                            onChange={(e) => handleChange('mailFromAddress', e.target.value)}
                                            className="mt-2"
                                            placeholder="noreply@yourplatform.com" />

                                    </div>
                                    <div>
                                        <Label htmlFor="mailFromName">Mail From Name</Label>
                                        <Input
                                            id="mailFromName"
                                            value={formData.mailFromName}
                                            onChange={(e) => handleChange('mailFromName', e.target.value)}
                                            className="mt-2"
                                            placeholder="Platform Name" />

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Section 4: Security Settings ── */}
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="border-b border-border bg-muted/30 px-6 py-3">
                                <h5 className="font-semibold text-base flex items-center gap-2">
                                    <Icon icon="solar:shield-keyhole-linear" width={20} />
                                    Security Settings
                                </h5>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                    <div>
                                        <Label htmlFor="enableOtp" className="text-sm font-medium">
                                            Enable OTP Option
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Master switch to make OTP available for schools
                                        </p>
                                    </div>
                                    <Switch
                                        id="enableOtp"
                                        checked={formData.enableOtp}
                                        onCheckedChange={(val) => handleChange('enableOtp', val)} />

                                </div>

                                <div>
                                    <Label htmlFor="masterOtp">Platform Master OTP</Label>
                                    <Input
                                        id="masterOtp"
                                        type="password"
                                        value={formData.masterOtp}
                                        onChange={(e) => handleChange('masterOtp', e.target.value)}
                                        className="mt-2"
                                        placeholder="Emergency master OTP code" />

                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Global emergency password. Any school user can use this to log in if their regular OTP fails.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Save Button ── */}
                        <div className="flex justify-center pb-4">
                            <Button type="submit" className="px-10 py-2.5 text-sm font-semibold">
                                <Icon icon="solar:diskette-linear" width={18} className="mr-2" />
                                Save All Settings
                            </Button>
                        </div>
                    </div>

                    {/* ============ RIGHT COLUMN — INSTRUCTIONS ============ */}
                    <div className="lg:col-span-4 col-span-12">
                        <div className="rounded-xl border border-border overflow-hidden sticky top-24">
                            <div className="border-b border-border bg-primary/5 px-6 py-3">
                                <h5 className="font-semibold text-base flex items-center gap-2">
                                    <Icon icon="solar:info-circle-linear" width={20} className="text-primary" />
                                    Instructions
                                </h5>
                            </div>
                            <div className="p-6 flex flex-col gap-5 text-sm text-muted-foreground leading-relaxed">
                                <div>
                                    <h6 className="font-semibold text-foreground mb-1.5">Branding</h6>
                                    <p>
                                        Update the global name, footer text, and logos for the entire SaaS platform.
                                        These are visible on the landing page and superadmin panels.
                                    </p>
                                </div>

                                <div>
                                    <h6 className="font-semibold text-foreground mb-1.5">Subscription Payments</h6>
                                    <p>
                                        Configure how you, the platform owner, will charge schools for their subscription plans.
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                                        <li><strong className="text-foreground">Default Currency:</strong> Sets the currency for all subscription plans.</li>
                                        <li><strong className="text-foreground">Payment Mode:</strong> 'Sandbox' is for testing. 'Live' is for real payments.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h6 className="font-semibold text-foreground mb-1.5">Security Settings</h6>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li><strong className="text-foreground">Enable OTP:</strong> Master switch to make OTP available for schools. It does not force it on them.</li>
                                        <li><strong className="text-foreground">Platform Master OTP:</strong> Global emergency password. Keep it secure.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h6 className="font-semibold text-foreground mb-1.5">Mail Settings</h6>
                                    <p>
                                        Provide your SMTP credentials here to ensure the system can send emails for
                                        registrations, notifications, password resets, and OTPs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>);

};

export default PlatformSettings;