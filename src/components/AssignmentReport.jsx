import { useAdCampaign } from '../context/AdCampaignContext';
import AssignmentReportContent from './AssignmentReportContent';
export { default as AssignmentReportContent } from './AssignmentReportContent';
export default function AssignmentReport() {
  const { workspace, reportSource, reportWorkspace } = useAdCampaign();
  return <AssignmentReportContent workspace={reportWorkspace || workspace} reportSource={reportSource}/>;
}
