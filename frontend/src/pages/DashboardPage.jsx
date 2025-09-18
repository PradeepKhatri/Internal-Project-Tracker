import React from "react";
import StageChart from "../components/StageChart";
import DeadlineList from "../components/DeadlineList";
import StagesInfo from "../components/StagesInfo";
import Announcement from "../components/Annoucement";
import { useAuth } from "../context/AuthContext";
import PublishForm from "../components/PublishForm";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div
      className="bg-cover bg-top bg-fixed min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 md:py-10 gap-6"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      <div className="flex flex-col gap-8">
        <Announcement />

        <div className="flex flex-col gap-8 md:gap-8 lg:gap-16 md:flex-row">
          <div className="w-full md:w-1/2">
            <StagesInfo />
          </div>
          <div className="w-full md:w-1/2">
            <DeadlineList />
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <StageChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
