import { useNavigate, useParams } from 'react-router';

import { ROUTES } from '@/constant/routes';

import { SchemeForm } from '../components';

/** صفحه افزودن (/base-info/new) و ویرایش (/base-info/:id/edit) طرح */
export const SchemeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return <SchemeForm schemeId={id ? Number(id) : null} onBack={() => navigate(ROUTES.BASE_INFO)} />;
};
