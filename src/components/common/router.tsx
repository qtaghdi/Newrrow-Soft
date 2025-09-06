import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/common/layout';
import Home from '@/pages/home';
import Knowledge from '@/pages/knowledge';
import Study from '@/pages/study';
import Program from '@/pages/program';
import Growth from '@/pages/growth';
import My from '@/pages/my';
import GroupPage from '@/pages/group';
import GroupJoin from '@/pages/group-join';
import GroupDetail from '@/pages/group-detail';

const AppRouter = () => {
  return (
    <BrowserRouter basename="/Newrrow-Soft">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/csr" element={<Knowledge />} />
          <Route path="/study" element={<Study />} />
          <Route path="/program" element={<Program />} />
          <Route path="/program/training" element={<Program />} />
          <Route path="/program/assignment" element={<Program />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/group/my" element={<GroupPage />} />
          <Route path="/group/join" element={<GroupJoin />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/my" element={<My />} />
          <Route path="/my/dashboard" element={<My />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;