import React from "react";
import Header from "@/components/shared/Header";
import { TransformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const transformation = TransformationTypes[type];

  if (!userId) redirect("/sign-in");

  const dbUser = await getUserById(userId);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={dbUser._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={dbUser.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
