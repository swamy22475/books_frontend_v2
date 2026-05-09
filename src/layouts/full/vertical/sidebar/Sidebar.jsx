import SidebarContent from './sidebaritems';
import SimpleBar from 'simplebar-react';
import { Icon } from '@iconify/react';
import FullLogo from '../../shared/logo/FullLogo';
import { Link, useLocation } from 'react-router';
import { useTheme } from 'src/components/provider/theme-provider';
import { AMLogo, AMMenu, AMMenuItem, AMSidebar, AMSubmenu } from 'tailwind-sidebar';
import 'tailwind-sidebar/styles.css';
import { useState, useEffect } from 'react';

const quotes = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" }];


const renderSidebarItems = (
  items,
  currentPath,
  onClose,
  isSubItem = false) => {
  return items.map((item) => {
    const isSelected = currentPath === item?.url;
    const IconComp = item.icon || null;

    const iconElement = IconComp ?
      <Icon icon={IconComp} height={21} width={21} /> :

      <Icon icon={'ri:checkbox-blank-circle-line'} height={9} width={9} />;


    // Heading
    if (item.heading) {
      return (
        <div className="mb-1" key={item.heading}>
          <AMMenu
            subHeading={item.heading}
            ClassName="hide-menu leading-21 text-sidebar-foreground font-bold uppercase text-xs dark:text-sidebar-foreground" />

        </div>);

    }

    // Submenu
    if (item.children?.length) {
      const isChildActive = (children) => {
        return children.some(child => {
          if (child.url && child.url === currentPath) return true;
          if (child.children) return isChildActive(child.children);
          return false;
        });
      };

      const isActiveGroup = isChildActive(item.children);

      return (
        <div key={item.id} className={isActiveGroup ? "active-submenu-group" : "inactive-submenu-group"}>
          <AMSubmenu
            icon={iconElement}
            title={item.name}
            ClassName="mt-0.5 text-sidebar-foreground dark:text-sidebar-foreground"
          >
            {renderSidebarItems(item.children, currentPath, onClose, true)}
          </AMSubmenu>
        </div>
      );
    }

    // Regular menu item
    const linkTarget = item.url?.startsWith('https') ? '_blank' : '_self';

    const itemClassNames = isSubItem ?
      `mt-0.5 text-sidebar-foreground dark:text-sidebar-foreground !hover:bg-transparent ${isSelected ? '!bg-transparent !text-primary' : ''}` :

      `mt-0.5 text-sidebar-foreground dark:text-sidebar-foreground`;

    return (
      <div onClick={onClose}>
        <AMMenuItem
          key={item.id}
          icon={iconElement}
          isSelected={isSelected}
          link={item.url || undefined}
          target={linkTarget}
          badge={!!item.isPro}
          badgeColor="bg-lightsecondary"
          badgeTextColor="text-secondary"
          disabled={item.disabled}
          badgeContent={item.isPro ? 'Pro' : undefined}
          component={Link}
          className={`${itemClassNames}`}>

          <span className="truncate flex-1">{item.title || item.name}</span>
        </AMMenuItem>
      </div>);

  });
};

const SidebarLayout = ({ onClose, collapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { theme } = useTheme();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Only allow "light" or "dark" for AMSidebar
  const sidebarMode = theme === 'light' || theme === 'dark' ? theme : undefined;

  return (
    <div
      className="fixed left-0 top-0 z-10 h-screen transition-transform duration-300 ease-in-out"
      style={{
        width: 270,
        transform: collapsed ? 'translateX(-270px)' : 'translateX(0)'
      }}>

      <AMSidebar
        collapsible="none"
        animation={true}
        showProfile={false}
        width={'270px'}
        showTrigger={false}
        mode={sidebarMode}
        className="border border-border dark:border-border bg-sidebar dark:bg-sidebar h-screen">

        {/* Logo */}
        <div className="px-6 flex items-center brand-logo overflow-hidden">
          <AMLogo component={Link} href="/super/dashboard" img="">
            <FullLogo />
          </AMLogo>
        </div>

        {/* Sidebar items */}
        <SimpleBar className="h-[calc(100vh-100px)]">
          <div className="px-6">
            <style dangerouslySetInnerHTML={{
              __html: `
              /* Override tailwind-sidebar's behavior */
              .inactive-submenu-group button.side_sub {
                background-color: transparent !important;
                color: inherit !important;
              }
              
              /* Force highlight on the active submenu parent group */
              .active-submenu-group > div > button.side_sub {
                background-color: rgba(93, 135, 255, 0.15) !important;
                color: #5D87FF !important;
                border: 1px solid rgba(93, 135, 255, 0.3) !important;
                border-radius: 8px;
              }
              
              .active-submenu-group > div > button.side_sub * {
                color: #5D87FF !important;
                font-weight: 600;
              }
            `}} />

            {SidebarContent.map((section, index) =>
              <div key={index}>
                {renderSidebarItems(
                  [
                    ...(section.heading ? [{ heading: section.heading }] : []),
                    ...(section.children || [])],

                  pathname,
                  onClose
                )}
              </div>
            )}

            {/* Inspirational Quotes Section */}
            <div className="mt-6 mb-4">
              <div
                className="relative w-full rounded-xl p-5 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #5D87FF 0%, #7C4DFF 50%, #E040FB 100%)'
                }}>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/10 -mr-4 -mt-4" />
                <div className="absolute bottom-0 left-0 w-10 h-10 rounded-full bg-white/10 -ml-2 -mb-2" />

                {/* Quote icon */}
                <div className="mb-2">
                  <Icon icon="mdi:format-quote-open" width={28} height={28} className="text-white/60" />
                </div>

                {/* Quote text */}
                <div
                  className="min-h-[72px] flex items-start"
                  style={{
                    opacity: fade ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out'
                  }}>

                  <p className="text-white text-[13px] leading-[1.5] italic font-light">
                    "{quotes[quoteIndex].text}"
                  </p>
                </div>

                {/* Author */}
                <div
                  className="mt-2 flex items-center gap-2"
                  style={{
                    opacity: fade ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out 0.1s'
                  }}>

                  <div className="w-5 h-[1px] bg-white/40" />
                  <span className="text-white/80 text-[11px] font-medium tracking-wide">
                    {quotes[quoteIndex].author}
                  </span>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {quotes.map((_, i) =>
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === quoteIndex ? 'bg-white scale-110' : 'bg-white/30'}`
                      } />

                  )}
                </div>
              </div>
            </div>
          </div>
        </SimpleBar>
      </AMSidebar>
    </div>);

};

export default SidebarLayout;