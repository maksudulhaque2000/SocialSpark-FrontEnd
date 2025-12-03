export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const EventListSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 h-48 md:h-auto bg-gray-300"></div>
        <div className="flex-1 p-6 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse">
      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-3"></div>
      <div className="flex justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
        ))}
      </div>
      <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
    </div>
  );
};

export const ReviewCardSkeleton = () => {
  return (
    <div className="border-b border-gray-200 pb-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-300 rounded w-16"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommentCardSkeleton = () => {
  return (
    <div className="border-b border-gray-200 pb-6 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-24 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="flex gap-4 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 bg-gray-300 rounded w-14"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-24 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-5 bg-gray-300 rounded w-32"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-300 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="h-8 bg-gray-300 rounded w-16"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );
};
