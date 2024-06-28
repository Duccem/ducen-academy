import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import Mux from '@mux/mux-node';
import { NextRequest, NextResponse } from 'next/server';
const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
export const PUT = async (
  req: NextRequest,
  {
    params: { courseId, sectionId },
  }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = auth();
    const values = await req.json();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: userId },
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const section = await db.courseSection.update({
      where: { id: sectionId, courseId },
      data: { ...values },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ['public'],
      });

      await db.muxData.create({
        data: {
          sectionId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id || '',
        },
      });
    }
    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    console.log('[EDIT SECTION ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};