import CategoriesList from "@/components/categories/CategoriesList";
import CourseCard from "@/components/course/CourseCard";
import { getCategories } from "@/lib/queries/categories";
import { getCoursesByCategory } from "@/lib/queries/courses";

export default async function Home({ searchParams }: { searchParams: { categoryId: string | null, search: string | null }} ) {
  const categories = await getCategories();
  const courses = await getCoursesByCategory(searchParams.categoryId || null, searchParams.search || null);
  return (
    <div>
      <CategoriesList categories={categories} selectedCategory={searchParams.categoryId || null}/>
      <div className="flex flex-wrap gap-7 justify-center">
        {
          courses.map((course) => (
            <CourseCard key={course.id} course={course}/>
          ))
        }
      </div>
    </div>
  );
}
