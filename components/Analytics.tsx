import React from 'react';
import { Campaign, CampaignStatus } from '../types';

interface AnalyticsProps {
  campaigns: Campaign[];
}

const StatCard: React.FC<{ title: string; value: string; extra?: string }> = ({ title, value, extra }) => (
    <div className="bg-whatsapp-light p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold text-whatsapp-gray">{title}</h3>
        <p className="text-4xl font-bold text-gray-100 mt-2">{value}</p>
        {extra && <p className="text-sm text-whatsapp-gray mt-1">{extra}</p>}
    </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ campaigns }) => {
  const completedCampaigns = campaigns.filter(c => c.status === CampaignStatus.Completed);

  const totalSent = completedCampaigns.reduce((acc, c) => acc + c.progress.sent, 0);
  const totalFailed = completedCampaigns.reduce((acc, c) => acc + c.progress.failed, 0);
  const totalMessages = totalSent + totalFailed;

  const overallSuccessRate = totalMessages > 0 ? ((totalSent / totalMessages) * 100).toFixed(1) : '0.0';
  const overallFailureRate = totalMessages > 0 ? ((totalFailed / totalMessages) * 100).toFixed(1) : '0.0';
  
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Campaign Analytics</h1>
      
      {completedCampaigns.length === 0 ? (
        <div className="bg-whatsapp-light p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-100">No Data Available</h2>
            <p className="text-whatsapp-gray mt-2">Complete a campaign to see analytics here.</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Completed Campaigns" value={completedCampaigns.length.toString()} />
                <StatCard title="Total Messages" value={totalMessages.toString()} extra={`(${totalSent} success, ${totalFailed} failed)`} />
                <StatCard title="Overall Success Rate" value={`${overallSuccessRate}%`} />
                <StatCard title="Overall Failure Rate" value={`${overallFailureRate}%`} />
            </div>

            <div className="bg-whatsapp-light p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Campaign Breakdown</h2>
                <div className="space-y-6">
                    {completedCampaigns.map(campaign => {
                        const campaignTotal = campaign.progress.sent + campaign.progress.failed;
                        const successRate = campaignTotal > 0 ? (campaign.progress.sent / campaignTotal * 100) : 0;
                        const failureRate = campaignTotal > 0 ? (campaign.progress.failed / campaignTotal * 100) : 0;
                        
                        return (
                            <div key={campaign.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                                <h3 className="text-xl font-bold text-gray-100">{campaign.name}</h3>
                                <div className="grid grid-cols-3 gap-4 mt-3 text-center text-sm">
                                    <div>
                                        <p className="text-whatsapp-gray">Total</p>
                                        <p className="font-bold text-lg text-gray-200">{campaignTotal}</p>
                                    </div>
                                    <div>
                                        <p className="text-whatsapp-gray">Success</p>
                                        <p className="font-bold text-lg text-green-400">{campaign.progress.sent} ({successRate.toFixed(1)}%)</p>
                                    </div>
                                    <div>
                                        <p className="text-whatsapp-gray">Failed</p>
                                        <p className="font-bold text-lg text-red-400">{campaign.progress.failed} ({failureRate.toFixed(1)}%)</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-whatsapp-gray mb-1">Delivery Visualization</p>
                                    <div className="flex h-4 w-full bg-whatsapp-dark rounded-full overflow-hidden">
                                        <div className="bg-whatsapp-teal" style={{ width: `${successRate}%` }} title={`Success: ${successRate.toFixed(1)}%`}></div>
                                        <div className="bg-red-600" style={{ width: `${failureRate}%` }} title={`Failed: ${failureRate.toFixed(1)}%`}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default Analytics;