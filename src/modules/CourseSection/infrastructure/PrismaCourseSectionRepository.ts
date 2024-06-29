import { PrismaClient } from '@prisma/client';
import { CourseSection } from '../domain/CourseSection';
import { CourseSectionRepository } from '../domain/CourseSectionRepository';
import { CourseSectionResource } from '../domain/CourseSectionResource';
import { VideoData } from '../domain/VideoData';

export class PrismaCourseSectionRepository implements CourseSectionRepository {
  constructor(private client: PrismaClient) {}
  get model() {
    return this.client.courseSection;
  }
  async getLastSectionPosition(courseId: string): Promise<number> {
    const lastSection = await this.model.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' },
    });
    return lastSection?.position || 0;
  }
  async getVideoData(sectionId: string): Promise<VideoData> {
    const videoData = await this.client.muxData.findFirst({
      where: { sectionId },
    });
    return videoData ? VideoData.fromPrimitives(videoData) : null;
  }
  async getSection(courseId: string, sectionId: string): Promise<CourseSection> {
    const section = await this.model.findFirst({
      where: { courseId, id: sectionId },
    });
    return section ? CourseSection.fromPrimitives(section) : null;
  }
  async getCoursesSections(courseId: string): Promise<CourseSection[]> {
    const sections = await this.model.findMany({
      where: { courseId },
    });
    return sections.map((section) => CourseSection.fromPrimitives(section));
  }
  async saveSection(section: CourseSection): Promise<void> {
    await this.model.upsert({
      where: { id: section.id },
      update: section.toPrimitives(),
      create: section.toPrimitives(),
    });
  }
  async addResource(resource: CourseSectionResource): Promise<void> {
    await this.client.courseSectionResource.create({
      data: resource.toPrimitives(),
    });
  }
  async createVideoData(videoData: VideoData): Promise<void> {
    await this.client.muxData.create({
      data: videoData.toPrimitives(),
    });
  }
  async removeResource(resourceId: string, sectionId: string): Promise<void> {
    await this.client.courseSectionResource.delete({
      where: { id: resourceId, sectionId },
    });
  }
  async removeVideoData(videoDataId: string): Promise<void> {
    await this.client.muxData.delete({
      where: { id: videoDataId },
    });
  }
  async deleteSection(sectionId: string): Promise<void> {
    await this.model.delete({ where: { id: sectionId } });
  }
}