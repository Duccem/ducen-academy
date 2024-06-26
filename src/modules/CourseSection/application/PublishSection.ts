import { FormatError } from '@/modules/shared/domain/core/errors/FormatError';
import { CourseSectionRepository } from '../domain/CourseSectionRepository';

export class PublishSection {
  constructor(private repository: CourseSectionRepository) {}

  async run(courseId: string, sectionId: string): Promise<void> {
    const section = await this.repository.getSection(courseId, sectionId);
    if (!section || !section.title || !section.description || !section.videoUrl) {
      throw new FormatError('Missing required fields');
    }
    section.publish();
    await this.repository.saveSection(section);
  }
}
