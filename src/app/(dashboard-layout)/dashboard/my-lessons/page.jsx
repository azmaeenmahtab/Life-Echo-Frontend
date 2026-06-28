import { MyLessonsTable } from "@/components/Dashboard/MyLessons";
import { getUserSessionServer } from "@/lib/actions/userSession";
import React from "react";

const MyLessonsPage = async () => {
  const session = await getUserSessionServer();
  console.log(session);
  return (
    <div>
      <MyLessonsTable user={session?.user} />
    </div>
  );
};

export default MyLessonsPage;
