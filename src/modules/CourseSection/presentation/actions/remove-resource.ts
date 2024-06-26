import { db } from '@/modules/shared/presentation/connections/db';
import { RemoveResource } from '../../application/RemoveResource';
import { PrismaCourseSectionRepository } from '../../infrastructure/PrismaCourseSectionRepository';

export const removeResource = async (resourceId: string, sectionId: string) => {
  const useCase = new RemoveResource(new PrismaCourseSectionRepository(db));
  await useCase.run(resourceId, sectionId);
};
