"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { CirclePlus, Heart } from "lucide-react";
import { Input } from "../ui/input";
import { createClient } from "@supabase/supabase-js";
import { createFeedPostAction, updateFeedPostAction } from "@/actions";

const supabaseClient = createClient(
  "https://ymsijpnegskkoiuerthi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltc2lqcG5lZ3Nra29pdWVydGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMzYzNDYsImV4cCI6MjAyOTgxMjM0Nn0.PM7Nr9qTZFEJsf62eHgkFXKGPqt0gfMdFN6SOJjCP6M"
);

function Feed({ user, profileInfo, allFeedPosts }) {
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    imageURL: "",
  });
  const [imageData, setImageData] = useState(null);

  function handleFileOnChange(event) {
    event.preventDefault();
    setImageData(event.target.files[0]);
  }

  function handleFetchImagePublicUrl(getData) {
    const { data } = supabaseClient.storage
      .from("job-board-public")
      .getPublicUrl(getData.path);

    console.log(data);

    if (data)
      setFormData({
        ...formData,
        imageURL: data.publicUrl,
      });
  }

  async function handleUploadImageToSupabase() {
    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`/public/${imageData?.name}`, imageData, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log(data, error);

    if (data) handleFetchImagePublicUrl(data);
  }

  async function handleSaveFeedPost() {
    await createFeedPostAction(
      {
        userId: user?.id,
        userName:
          profileInfo?.candidateInfo?.name || profileInfo?.recruiterInfo?.name,
        message: formData?.message,
        image: formData?.imageURL,
        likes: [],
      },
      "/feed"
    );

    setFormData({
      imageURL: "",
      message: "",
    });
  }

  async function handleUpdateFeedPostLikes(getCurrentFeedPostItem) {
    let cpyLikesFromCurrentFeedPostItem = [...getCurrentFeedPostItem.likes];
    const index = cpyLikesFromCurrentFeedPostItem.findIndex(
      (likeItem) => likeItem.reactorUserId === user?.id
    );

    if (index === -1)
      cpyLikesFromCurrentFeedPostItem.push({
        reactorUserId: user?.id,
        reactorUserName:
          profileInfo?.candidateInfo?.name || profileInfo?.recruiterInfo?.name,
      });
    else cpyLikesFromCurrentFeedPostItem.splice(index, 1);

    getCurrentFeedPostItem.likes = cpyLikesFromCurrentFeedPostItem;
    await updateFeedPostAction(getCurrentFeedPostItem, "/feed");
  }

  useEffect(() => {
    if (imageData) handleUploadImageToSupabase();
  }, [imageData]);

  console.log(allFeedPosts);

  return (
    <Fragment>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between dark:border-white border-b pb-6 pt-24">
          <h1 className="dark:text-white text-4xl font-bold tracking-tight text-gray-900">
            Explore Feed
          </h1>
          <div className="flex items-center">
            <Button
              onClick={() => setShowPostDialog(true)}
              className="flex h-11 items-center justify-center px-5"
            >
              Add New Post
            </Button>
          </div>
        </div>
        <div className="py-12">
          <div className="container m-auto p-0 flex flex-col gap-5 text-gray-700">
            {allFeedPosts && allFeedPosts.length > 0 ? (
              allFeedPosts.map((feedPostItem) => (
                <div
                  key={feedPostItem._id}
                  className="group relative -mx-4 p-6 rounded-3xl bg-gray-100 hover:bg-white hover:shadow-2xl cursor-auto shadow-2xl shadow-transparent gap-8 flex"
                >
                  <div className="sm:w-2/6 rounded-3xl overflow-hidden transition-all duration-500 group-hover:rounded-xl">
                    <img
                      src={feedPostItem?.image}
                      alt="Post"
                      className="h-80 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="sm:p-2 sm:pl-0 sm:w-4/6">
                    <span className="mt-4 mb-2 inline-block font-medium text-gray-500 sm:mt-0">
                      {feedPostItem?.userName}
                    </span>
                    <h3 className="mb-6 text-4xl font-bold text-gray-900">
                      {feedPostItem?.message}
                    </h3>
                    <div className="flex gap-5">
                      <Heart
                        size={25}
                        fill={
                          feedPostItem?.likes?.length > 0
                            ? "#000000"
                            : "#ffffff"
                        }
                        className="cursor-pointer"
                        onClick={() => handleUpdateFeedPostLikes(feedPostItem)}
                      />
                      <span className="font-semibold text-xl">
                        {feedPostItem?.likes?.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>No posts found!</h1>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={showPostDialog}
        onOpenChange={() => {
          setShowPostDialog(false);
          setFormData({
            message: "",
            imageURL: "",
          });
        }}
      >
        <DialogContent className="h-[550px]">
          <Textarea
            name="message"
            value={formData?.message}
            onChange={(event) =>
              setFormData({
                ...formData,
                message: event.target.value,
              })
            }
            placeholder="What do you want to talk about?"
            className="border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[200px] text-[28px]"
          />

          <div className="flex gap-5 items-center justify-between">
            <Label for="imageURL">
              <CirclePlus />
              <Input
                onChange={handleFileOnChange}
                className="hidden"
                id="imageURL"
                type="file"
              />
            </Label>
            <Button
              onClick={handleSaveFeedPost}
              disabled={formData?.imageURL === "" && formData?.message === ""}
              className="flex w-40 h-11 items-center justify-center px-5 disabled:opacity-65"
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default Feed;
