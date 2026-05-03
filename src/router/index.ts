import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth';

import HomePage from '../views/HomePage.vue'
import AboutPage from '../views/AboutPage.vue'
import AnnouncementPage from '../views/AnnouncementPage.vue'
import GalleryPage from '../views/GalleryPage.vue'
import PersonnelPage from '../views/PersonnelPage.vue'
import RecordPage from '../views/RecordPage.vue'
import ServicesPage from '../views/ServicesPage.vue'

//other route
import BSPPage from '@/views/OtherRoutes/BSPPage.vue'
import NBWCPage from '@/views/OtherRoutes/NBWCPage.vue'
import Starbooks from '@/views/OtherRoutes/Starbooks.vue'
import AVRPage from '@/views/OtherRoutes/AVRPage.vue'
import TopBorrowers from '@/views/OtherRoutes/TopBorrowers.vue'
import NewlyAcquiredBooksPage from '@/views/OtherRoutes/NewlyAcquiredBooksPage.vue'
import EResources from '@/views/OtherRoutes/EResources.vue'

//admin
import Dashboard from '@/views/Admin/Dashboard.vue'
import Login from '@/views/Admin/Login.vue'
import Signin from '@/views/Admin/Signin.vue'
import AnnouncementOverview from '@/views/Admin/Announcements/AnnouncementOverview.vue'
import GeneralInput from '@/views/Admin/Announcements/GeneralInput.vue'
import NewsInput from '@/views/Admin/Announcements/NewsInput.vue'
import PersonnelOverview from '@/views/Admin/PersonnelManagement/PersonnelOverview.vue'
import ServicesOverview from '@/views/Admin/ServicesManagement/ServicesOverview.vue'
import ManageRecords from '@/views/Admin/ServicesManagement/ManageRecords.vue'
import ManageGallery from '@/views/Admin/ServicesManagement/ManageGallery.vue'
import ManageCurriculum from '@/views/Admin/ServicesManagement/ManageCurriculum.vue'
import CurriculumInfo from '@/views/Admin/ServicesManagement/Curriculum/CurriculumInfo.vue'
import CurriculumEdit from '@/views/Admin/ServicesManagement/Curriculum/CurriculumEdit.vue'
import ProgramStudy from '@/views/Admin/ServicesManagement/Curriculum/ProgramStudy.vue'
import WebsiteOverview from '@/views/Admin/WebsiteManagement/WebsiteOverview.vue'
import WebsiteImages from '@/views/Admin/WebsiteManagement/WebsiteImages.vue'
import WebsiteGeneral from '@/views/Admin/WebsiteManagement/WebsiteGeneral.vue'
import ManageAbout from '@/views/Admin/WebsiteManagement/ManageAbout.vue'
import ManageServices from '@/views/Admin/WebsiteManagement/ManageServices.vue'
import UsersManagement from '@/views/Admin/AdminManagement/UsersManagement.vue'
import ActivateDeactivate from '@/views/Admin/AdminManagement/ActivateDeactivate.vue'
import ManagePermission from '@/views/Admin/AdminManagement/ManagePermission.vue'
import ManageRoles from '@/views/Admin/AdminManagement/ManageRoles.vue'
import ViewUsers from '@/views/Admin/AdminManagement/ViewUsers.vue'
import BackupSettings from '@/views/Admin/AdminManagement/BackupSettings.vue'
import Developers from '@/views/Developers.vue'
import CurriculumAdd from '@/views/Admin/ServicesManagement/Curriculum/CurriculumAdd.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.pBASE_URL),
  routes: [
    //main navbars
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/announcements', name: 'announcements', component: AnnouncementPage },
    { path: '/gallery', name: 'gallery', component: GalleryPage },
    { path: '/personnel', name: 'personnel', component: PersonnelPage },
    { path: '/records', name: 'records', component: RecordPage },
    { path: '/services', name: 'services', component: ServicesPage },

    //other routes
    { path: '/avr', name: 'avr', component: AVRPage },
    { path: '/top-borrowers', name: 'top-borrowers', component: TopBorrowers },
    { path: '/newlyacquiredbooks', name: 'newlyacquiredbooks', component: NewlyAcquiredBooksPage },
    { path: '/bcp', name: 'bcppage', component: BSPPage },
    { path: '/nbwc', name: 'nbwcpage', component: NBWCPage },
    { path: '/starbooks', name: 'starbooks', component: Starbooks },
    { path: '/e-resources', name: 'eresources', component: EResources },
  { path: '/developers', name: 'developers', component: Developers },

    //admin
    { path: '/admin', name: 'admin', component: Dashboard, meta: { requiresAuth: true }   },
    { path: '/admin/login', name: 'login', component: Login },
    { path: '/admin/signin', name: 'signin', component: Signin },
    { path: '/admin/announcement', name: 'announcement', component: AnnouncementOverview,meta: { requiresAuth: true }   },
    { path: '/admin/announcement/general', name: 'announcement-general', component: GeneralInput, meta: { requiresAuth: true }  },
    { path: '/admin/announcement/news', name: 'announcement-news', component: NewsInput, meta: { requiresAuth: true }  },
    { path: '/admin/personnel', name: 'admin-personnel', component: PersonnelOverview, meta: { requiresAuth: true } },
    { path: '/admin/services', name: 'admin-services', component: ServicesOverview, meta: { requiresAuth: true } },
    { path: '/admin/services/records', name: 'services-records', component: ManageRecords, meta: { requiresAuth: true }  },
    { path: '/admin/services/gallery', name: 'services-gallery', component: ManageGallery, meta: { requiresAuth: true }  },
    { path: '/admin/services/curriculum', name: 'services-curriculum', component: ManageCurriculum, meta: { requiresAuth: true }  },
    { path: '/admin/services/curriculum/curriculum-info', name: 'curriculum-info', component: CurriculumInfo, meta: { requiresAuth: true }  },
    { path: '/admin/curriculum/info/:programId/:specializationId?', name: 'curriculum-info-dynamic', component: CurriculumInfo, meta: { requiresAuth: true }  },
    { path: '/admin/services/curriculum/program-study/:programId/:specializationId?', name: 'program-study', component: ProgramStudy,meta: { requiresAuth: true }   },
    { path: '/admin/services/curriculum/edit', name: 'curriculum-edit', component: CurriculumEdit, meta: { requiresAuth: true }   },
    { path: '/admin/services/curriculum/add', name: 'curriculum-add', component: CurriculumAdd, meta: { requiresAuth: true }   },
    { path: '/admin/website', name: 'website', component: WebsiteOverview, meta: { requiresAuth: true } },
    { path: '/admin/website/images', name: 'website-images', component: WebsiteImages, meta: { requiresAuth: true }  },
    { path: '/admin/website/general', name: 'website-general', component: WebsiteGeneral, meta: { requiresAuth: true }   }, 
    { path: '/admin/website/about', name: 'website-about', component: ManageAbout, meta: { requiresAuth: true }  }, 
    { path: '/admin/website/services', name: 'website-services', component: ManageServices, meta: { requiresAuth: true }  }, 
    { path: '/admin/management', name: 'admin-management', component: UsersManagement,meta: { requiresAdmin: true, requiresAuth: true  } },
    { path: '/admin/management/view-users', name: 'admin-management-view', component: ViewUsers, meta: { requiresAuth: true }  },    
    { path: '/admin/management/activation', name: 'admin-management-activation', component: ActivateDeactivate, meta: { requiresAuth: true }  }, 
    { path: '/admin/management/roles', name: 'admin-management-roles', component: ManageRoles, meta: { requiresAuth: true }  },  
    { path: '/admin/management/permission', name: 'admin-management-permission', component: ManagePermission, meta: { requiresAuth: true }  }, 
    { path: '/admin/settings/backup', name: 'admin-settings-backup', component: BackupSettings,meta: { requiresAuth: true } }, 
  ],
   scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuth()

  await auth.loadSession()

  const session = auth.session.value
  const profile = auth.profile.value

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  // Not logged in
  if (requiresAuth && !session) {
    return '/admin/login'
  }

  // Prevent going back to login
  if ((to.path === '/admin/login' || to.path === '/admin/signin') && session) {
    return '/admin'
  }

  // RBAC (no infinite loop)
  if (requiresAdmin) {
    const isAdmin = profile?.role === 'admin'

    if (!isAdmin && !to.query.denied) {
      return {
        path: to.path,
        query: { ...to.query, denied: 'true' }
      }
    }
  }

  // allow navigation
  return true
})

export default router
