import React from "react";
import StageChart from "../components/StageChart";
import DeadlineList from "../components/DeadlineList";
import StagesInfo from "../components/StagesInfo";
import DashboardComment from "../components/DashboardComment";

const DashboardPage = () => {
  return (
    <div
      className="bg-cover bg-top bg-fixed min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 md:py-10 gap-6"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      {/* <DashboardComment /> */}
      {/* <StageChart />   */}

      <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 md:flex-row">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <StagesInfo />
        </div>
        <div className="w-full md:w-1/2">
          <DeadlineList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
