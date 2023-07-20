import { cn } from "@/lib/utils";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  const mockMessages = [
    {
      id: 1,
      isCurrentUser: true,
      hasNextMessageFromSameUser: false,
    },
    {
      id: 2,
      isCurrentUser: false,
      hasNextMessageFromSameUser: false,
    },
    {
      id: 3,
      isCurrentUser: false,
      hasNextMessageFromSameUser: true,
    },
    {
      id: 4,
      isCurrentUser: true,
      hasNextMessageFromSameUser: false,
    },
  ];

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Skeleton width={50} height={50} borderRadius={200} />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                <Skeleton height={20} width={250} />
              </span>
            </div>
            <span className="text-sm text-gray-600">
              <Skeleton height={15} width={200} />
            </span>
          </div>
        </div>
      </div>

      <div
        id="messages"
        className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div />
        {mockMessages.map((message) => {
          const { isCurrentUser, hasNextMessageFromSameUser, id } = message;
          return (
            <div key={id} className="chat-message">
              <div
                className={cn("flex items-end", {
                  "justify-end": isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    "flex flex-col space-y-2 text-base max-w-xs mx-2",
                    {
                      "order-1 items-end": isCurrentUser,
                      "order-2 items-start": !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn(
                      "px-4 py-2 rounded-lg flex flex-row items-end",
                      {
                        "bg-indigo-600": isCurrentUser,
                        "bg-indigo-400": !isCurrentUser,
                        "rounded-br-none":
                          !hasNextMessageFromSameUser && isCurrentUser,
                        "rounded-bl-none":
                          !hasNextMessageFromSameUser && !isCurrentUser,
                      }
                    )}
                  >
                    <Skeleton width={200} height={20} />{" "}
                    <span className="ml-2 text-xs text-indigo-400">
                      <Skeleton
                        width={30}
                        height={15}
                        className="inline-block"
                      />
                    </span>
                  </span>
                </div>

                <div
                  className={cn("relative w-6 h-6", {
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <Skeleton width={25} height={25} borderRadius={200} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <div className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6">
            <Skeleton width={200} height={18} className="mx-3" />
          </div>
          <div className="py-2">
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
              <Skeleton width={60} height={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
