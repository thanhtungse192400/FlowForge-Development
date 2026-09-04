import { useState, useEffect, useCallback } from 'react';
import taskCommentApi from "../../Task/apiTask/taskCommentApi";

export const useTaskComments = (taskId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!taskId) return;
    
    try {
      setIsLoading(true);
      const response = await taskCommentApi.getTaskComments(taskId);
      
      // LOG DỮ LIỆU ĐỂ KIỂM TRA
      // console.log("Raw API Response:", response.data);
      
      // Xử lý trực tiếp: vì API trả về mảng, ta gán luôn
      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else if (response.data?.data) {
        // Dự phòng trường hợp API đổi cấu trúc quay lại có field 'data'
        setComments(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content) => {
    try {
      const response = await taskCommentApi.postTaskComment(taskId, { content });
      
      // Kiểm tra phản hồi sau khi POST (thường sẽ trả về object comment đơn lẻ)
      if (response.data) {
        // Cập nhật UI ngay lập tức
        setComments(prev => [...prev, response.data]);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  };

  return { comments, isLoading, addComment, refreshComments: fetchComments };
};

export default useTaskComments;