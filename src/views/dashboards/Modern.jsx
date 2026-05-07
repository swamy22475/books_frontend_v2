import { TopCards } from "../../components/dashboards/modern/TopCards";
import { RevenueUpdate } from "../../components/dashboards/modern/RevenueUpdate";
import { YearlyBreakup } from "../../components/dashboards/modern/YearlyBreakup";
import { MonthlyEarning } from "../../components/dashboards/modern/MonthlyEarning";
import { RecentTransaction } from "../../components/dashboards/modern/RecentTransaction";
import { TenantList } from "../../components/dashboards/modern/TenantList";
import { Footer } from "../../components/dashboards/modern/Footer";
import ProfileWelcome from "../../components/dashboards/modern/ProfileWelcome";

const Moderndash = () => {
    return (
        <>
            <div className="grid grid-cols-12 gap-6">
                {/* Welcome Banner */}
                <div className="col-span-12">
                    <ProfileWelcome />
                </div>

                {/* Scrolling Cards Section - Featured prominently */}
                <div className="col-span-12">
                    <TopCards />
                </div>

                {/* Main Content Grid */}
                <div className="lg:col-span-8 col-span-12 flex">
                    <RevenueUpdate />
                </div>
                <div className="lg:col-span-4 col-span-12">
                    <YearlyBreakup />
                    <MonthlyEarning />
                </div>

                {/* Secondary Content Grid */}
                <div className="lg:col-span-4 col-span-12">
                    <RecentTransaction />
                </div>
                <div className="lg:col-span-8 col-span-12 flex">
                    <TenantList />
                </div>

                {/* Footer */}
                <div className="col-span-12">
                    <Footer />
                </div>
            </div>
        </>);

};

export default Moderndash;