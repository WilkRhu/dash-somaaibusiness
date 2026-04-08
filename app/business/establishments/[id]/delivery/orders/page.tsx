import { redirect } from 'next/navigation';

export default function BusinessDeliveryOrdersRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/admin/business/establishments/${params.id}/delivery`);
}
