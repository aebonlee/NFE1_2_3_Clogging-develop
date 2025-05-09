import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { postId, author, content, password, isPrivate } =
      await request.json();

    if (!postId || !author || !content || !password) {
      return NextResponse.json({ error: '필드 비어있음!' }, { status: 400 });
    }

    if (password.length !== 4 || isNaN(Number(password))) {
      return NextResponse.json(
        { error: '비밀번호는 숫자 4자리이어야 합니다!' },
        { status: 400 },
      );
    }

    const newComment = {
      author,
      content,
      password,
      isPrivate: isPrivate || false,
      createdAt: Timestamp.now(),
    };

    const commentsRef = collection(db, 'posts', postId, 'comments');
    const docRef = await addDoc(commentsRef, newComment);

    return NextResponse.json(
      {
        message: '댓글 작성 성공!',
        comment: {
          id: docRef.id,
          ...newComment,
          createdAt: newComment.createdAt.toDate().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: '댓글 작성 실패!' }, { status: 500 });
  }
}
