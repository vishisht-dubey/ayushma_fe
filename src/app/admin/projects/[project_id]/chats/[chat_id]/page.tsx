"use client";

import Loading from "@/components/ui/loading";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { project_id: string; chat_id: string };
}) {
  const { project_id, chat_id } = params;
  const chatQuery = useQuery({
    queryKey: ["chat", project_id, chat_id],
    queryFn: () => API.chat.get(project_id, chat_id),
  });

  const projectQuery = useQuery({
    queryKey: ["project", project_id],
    queryFn: () =>
      API.projects.get(project_id),
  });
  const project: Project = projectQuery.data;
  const chats: any | undefined = chatQuery.data;

  return (
    <div>
      <h1 className="text-3xl font-bold">{project?.title}</h1>
      {chatQuery.isLoading ? (
        <div className="mt-5 w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : chats ? (
        <div>
          <div className="flex flex-col mt-6 md:flex-row justify-between items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">Chat: {chats?.title}</h2>
            <div className="flex justify-center items-center">
              {chats?.username && (
                <Link
                  href={`/admin/users/${chats?.username}`}
                  className="bg-primary flex items-center gap-2 justify-center hover:bg-slate-300 m-2 p-2 rounded-xl px-6"
                >
                  <i className="fa fa-user"></i>
                  {chats?.username}
                </Link>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4 mt-8">
              {chats && chats?.chats?.length > 0 ? (
                chats?.chats.map((chat: any, i: number) => (
                  <div key={i}>
                    {chat.messageType === 1 ? (
                      <div className="border border-secondaryActive hover:bg-secondary bg-primary rounded-lg p-4">
                        {chat.message}
                      </div>
                    ) : (
                      <div className="border border-secondaryActive hover:bg-secondary bg-secondaryActive rounded-lg p-4">
                        {chat.message}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex justify-center bg-primary rounded-xl p-3">
                  No Chats Found
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-primaryLightfont text-2xl font-medium mt-6">
          Chat not found
        </div>
      )}
    </div>
  );
}