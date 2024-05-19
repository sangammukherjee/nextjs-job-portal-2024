"use server";

import connectToDB from "@/database";
import Application from "@/models/application";
import Feed from "@/models/feed";
import Job from "@/models/job";
import Profile from "@/models/profile";
import { revalidatePath } from "next/cache";

const stripe = require("stripe")(
  "sk_test_51NMv6ZSC6E6fnyMeTYV3h3Xge6Tot3xYQVEO6KMpiB5A6bKIrRS9YymIBEupAFqF0XM274IwwU2Zq7EXx1Pn8LiA00SyPEZqk9"
);

//create profile action
export async function createProfileAction(formData, pathToRevalidate) {
  await connectToDB();
  await Profile.create(formData);
  revalidatePath(pathToRevalidate);
}

export async function fetchProfileAction(id) {
  await connectToDB();
  const result = await Profile.findOne({ userId: id });

  return JSON.parse(JSON.stringify(result));
}

//create job action

export async function postNewJobAction(formData, pathToRevalidate) {
  await connectToDB();
  await Job.create(formData);
  revalidatePath(pathToRevalidate);
}

//fetch job action
//recruiter
export async function fetchJobsForRecruiterAction(id) {
  await connectToDB();
  const result = await Job.find({ recruiterId: id });

  return JSON.parse(JSON.stringify(result));
}
//candidate
export async function fetchJobsForCandidateAction(filterParams = {}) {
  await connectToDB();
  let updatedParams = {};
  Object.keys(filterParams).forEach((filterKey) => {
    updatedParams[filterKey] = { $in: filterParams[filterKey].split(",") };
  });
  console.log(updatedParams, "updatedParams");
  const result = await Job.find(
    filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {}
  );

  return JSON.parse(JSON.stringify(result));
}

//create job application

export async function createJobApplicationAction(data, pathToRevalidate) {
  await connectToDB();
  await Application.create(data);
  revalidatePath(pathToRevalidate);
}

//fetch job applications - candidate
export async function fetchJobApplicationsForCandidate(candidateID) {
  await connectToDB();
  const result = await Application.find({ candidateUserID: candidateID });

  return JSON.parse(JSON.stringify(result));
}

//fetch job applications - recruiter

export async function fetchJobApplicationsForRecruiter(recruiterID) {
  await connectToDB();
  const result = await Application.find({ recruiterUserID: recruiterID });

  return JSON.parse(JSON.stringify(result));
}

//update job application
export async function updateJobApplicationAction(data, pathToRevalidate) {
  await connectToDB();
  const {
    recruiterUserID,
    name,
    email,
    candidateUserID,
    status,
    jobID,
    _id,
    jobAppliedDate,
  } = data;
  await Application.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      recruiterUserID,
      name,
      email,
      candidateUserID,
      status,
      jobID,
      jobAppliedDate,
    },
    { new: true }
  );
  revalidatePath(pathToRevalidate);
}

//get candidate detAils by candidate ID
export async function getCandidateDetailsByIDAction(currentCandidateID) {
  await connectToDB();
  const result = await Profile.findOne({ userId: currentCandidateID });

  return JSON.parse(JSON.stringify(result));
}

//create filter categories
export async function createFilterCategoryAction() {
  await connectToDB();
  const result = await Job.find({});

  return JSON.parse(JSON.stringify(result));
}

//update profile action
export async function updateProfileAction(data, pathToRevalidate) {
  await connectToDB();
  const {
    userId,
    role,
    email,
    isPremiumUser,
    memberShipType,
    memberShipStartDate,
    memberShipEndDate,
    recruiterInfo,
    candidateInfo,
    _id,
  } = data;

  await Profile.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      role,
      email,
      isPremiumUser,
      memberShipType,
      memberShipStartDate,
      memberShipEndDate,
      recruiterInfo,
      candidateInfo,
    },
    { new: true }
  );

  revalidatePath(pathToRevalidate);
}

//create stripe price id based on tier selection
export async function createPriceIdAction(data) {
  const session = await stripe.prices.create({
    currency: "inr",
    unit_amount: data?.amount * 100,
    recurring: {
      interval: "year",
    },
    product_data: {
      name: "Premium Plan",
    },
  });

  return {
    success: true,
    id: session?.id,
  };
}

//create payment logic
export async function createStripePaymentAction(data) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: data?.lineItems,
    mode: "subscription",
    success_url: `${process.env.URL}/membership` + "?status=success",
    cancel_url: `${process.env.URL}/membership` + "?status=cancel",
  });

  return {
    success: true,
    id: session?.id,
  };
}

//create post action
export async function createFeedPostAction(data, pathToRevalidate) {
  await connectToDB();
  await Feed.create(data);
  revalidatePath(pathToRevalidate);
}

//fetch all posts action
export async function fetchAllFeedPostsAction() {
  await connectToDB();
  const result = await Feed.find({});

  return JSON.parse(JSON.stringify(result));
}

//update post action
export async function updateFeedPostAction(data, pathToRevalidate) {
  await connectToDB();
  const { userId, userName, message, image, likes, _id } = data;
  await Feed.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      userName,
      image,
      message,
      likes,
    },
    { new: true }
  );

  revalidatePath(pathToRevalidate);
}
