"use client";

import { useRouter } from "next/navigation";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";
import { Button } from "../ui/button";

function Companies({ jobsList }) {
  const router = useRouter();

  const createUniqueSetOfCompanies = [
    ...new Set(
      jobsList
        .filter(
          (jobItem) =>
            jobItem?.companyName && jobItem?.companyName.trim() !== ""
        )
        .map((item) => item.companyName)
    ),
  ];

  function handleFilterJobsByCompanyName(getCompanyName) {
    sessionStorage.setItem(
      "filterParams",
      JSON.stringify({
        companyName: [getCompanyName],
      })
    );

    router.push("/jobs");
  }

  console.log(createUniqueSetOfCompanies);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-24">
        <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900">
          Browse Companies
        </h1>
      </div>
      <div className="pt-6 pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div className="lg:col-span-4">
            <div className="container mx-auto p-0 space-y-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                {createUniqueSetOfCompanies &&
                createUniqueSetOfCompanies.length > 0 ? (
                  createUniqueSetOfCompanies.map((companyName) => (
                    <CommonCard
                      icon={<JobIcon />}
                      title={companyName}
                      footerContent={
                        <Button
                          onClick={() =>
                            handleFilterJobsByCompanyName(companyName)
                          }
                          className="dark:bg-[#fffa27] h-11 flex items-center justify-center px-5"
                        >
                          See Jobs
                        </Button>
                      }
                    />
                  ))
                ) : (
                  <h1>No Companies present!</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companies;
