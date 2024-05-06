import {
  fetchJobApplicationsForCandidate,
  fetchJobsForCandidateAction,
} from "@/actions";
import CandidateActivity from "@/components/candidate-activity";
import { currentUser } from "@clerk/nextjs";

export default async function Activity() {
  const user = await currentUser();
  const jobList = await fetchJobsForCandidateAction();
  const jobApplicants = await fetchJobApplicationsForCandidate(user?.id);

  return <CandidateActivity jobList={jobList} jobApplicants={jobApplicants} />;
}
