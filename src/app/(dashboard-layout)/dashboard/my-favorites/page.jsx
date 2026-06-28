import MyFavorites from "@/components/Dashboard/MyFavorites";
import { getUserSessionServer } from "@/lib/actions/userSession";
import React from "react";

const MyFavoritesPage = async () => {
  const session = await getUserSessionServer();
  return (
    <div>
      <MyFavorites loggedInUser={session?.user} />
    </div>
  );
};

export default MyFavoritesPage;
