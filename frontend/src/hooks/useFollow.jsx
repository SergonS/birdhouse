// React
// Tanstack
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Toast
import toast from 'react-hot-toast';

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async(userId) => {
            try
            {
                // Post
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST"
                });

                // Receiving response
                const data = await res.json();

                // Check for errors
                if (!res.ok)
                {
                    throw new Error(data.error || "Follow/Unfollow failed");
                }

                return;
            }
            catch (error)
            {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate sync queries
            Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);          
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { follow, isPending };
};

export default useFollow;