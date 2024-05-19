import { fetchJobsForCandidateAction, fetchProfileAction } from "@/actions";
import Companies from "@/components/companies";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function CompaniesPage() {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);

  if (!profileInfo) redirect("/onboard");
  const jobsList = await fetchJobsForCandidateAction({});

  return <Companies jobsList={jobsList} />;
}

export default CompaniesPage;
