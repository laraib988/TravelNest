'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBlogNewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/blogs/new/edit');
  }, [router]);
  return null;
}