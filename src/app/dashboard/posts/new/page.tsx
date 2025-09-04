'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PostForm } from '@/components/posts/PostForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PostForm isNewPost={true} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
