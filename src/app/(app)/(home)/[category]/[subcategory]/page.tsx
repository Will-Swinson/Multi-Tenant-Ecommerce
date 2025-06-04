interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategoryPage({ params }: Props) {
  const { category, subcategory } = await params;
  return (
    <div>
      Current Category: {category}-{subcategory}
    </div>
  );
}
