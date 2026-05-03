<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="'SERVICES'"></Sidebar>

    <main class="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
      <header class="report-header intro-header">
        <div class="header-left">
          <div class="header-breadcrumb !mb-0">
            <span
              class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
              @click="$router.push('/admin/services/curriculum')"
            >
              BACK
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span>Curriculum</span>
          </div>
          <h1
            class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]"
          >
            <span
              class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[220px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]"
              >Curriculum</span
            >
            <span class="text-yellow-500"> Information</span>
          </h1>
          <p class="header-sub">
            Edit curriculum information for academic programs.
          </p>
        </div>
      </header>

      <section
        class="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-xl border border-slate-200 bg-[#f5f3ef] p-8 shadow-sm mt-6"
      >
        <!-- College and Program dropdowns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">College</label>
            <select
              v-model="selectedCollege"
              @change="onCollegeChange"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            >
              <option value="">Select College...</option>
              <option v-for="college in colleges" :key="college.id" :value="college.id">
                {{ college.code }} - {{ college.name }}
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Program / Specialization</label>
            <select
              v-model="selectedProgram"
              @change="onProgramChange"
              :disabled="!selectedCollege"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Program...</option>
              <option v-for="prog in filteredPrograms" :key="prog.id" :value="prog.id">
                {{ prog.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Revision No, Legal Basis, Effectivity -->
        <div v-if="isLoadingCurriculum" class="flex items-center justify-center py-8">
          <span class="text-sm text-slate-600">Loading curriculum data...</span>
        </div>

        <template v-else-if="selectedProgram">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Revision No.</label>
              <input
                v-model="curriculumForm.revision_no"
                type="text"
                placeholder="Revision No."
                class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal Basis</label>
              <input
                v-model="curriculumForm.legal_basis"
                type="text"
                placeholder="Legal Basis"
                class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Effectivity</label>
              <input
                v-model="curriculumForm.effectivity_term"
                type="text"
                placeholder="Effectivity"
                class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
            <textarea
              v-model="curriculumForm.description"
              placeholder="Description"
              rows="4"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"
            ></textarea>
          </div>

          <!-- Requirements and Courses Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left: Requirements to Complete the Degree -->
            <div class="flex flex-col gap-3">
              <h3 class="text-sm font-bold uppercase tracking-wide text-[#164d23] border-b-2 border-[#164d23] pb-2">
                Requirements to Complete the Degree
              </h3>

              <div v-if="curriculumDetail?.requirements?.length === 0" class="text-sm text-slate-500 italic py-4">
                No requirements added yet
              </div>

              <div v-for="requirement in curriculumDetail?.requirements" :key="requirement.id" class="flex flex-col gap-2">
                <button
                  @click="toggleRequirement(requirement.id)"
                  class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] transition flex justify-between items-center"
                >
                  <span>{{ requirement.name }}</span>
                  <span>{{ expandedRequirements[requirement.id] ? '▼' : '▶' }}</span>
                </button>

                <div v-if="expandedRequirements[requirement.id]" class="pl-4 space-y-2 border-l-2 border-slate-300">
                  <input
                    :value="requirement.name"
                    @input="updateRequirement(requirement.id, { name: ($event.target as HTMLInputElement).value })"
                    type="text"
                    placeholder="Requirement name"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                  />
                  <textarea
                    :value="requirement.description || ''"
                    @input="updateRequirement(requirement.id, { description: ($event.target as HTMLTextAreaElement).value })"
                    placeholder="Description (optional)"
                    rows="2"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"
                  ></textarea>
                  <div class="flex gap-2">
                    <button
                      @click="deleteRequirement(requirement.id)"
                      class="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete Requirement
                    </button>
                  </div>
                </div>
              </div>

              <button
                @click="addRequirement"
                class="w-fit rounded-lg bg-[#0d2b0f] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
              >
                + Add Requirement
              </button>
            </div>

            <!-- Right: Courses in Requirements -->
            <div class="flex flex-col gap-3">
              <h3 class="text-sm font-bold uppercase tracking-wide text-[#164d23] border-b-2 border-[#164d23] pb-2">
                Courses by Requirement
              </h3>

              <div v-if="!curriculumDetail?.requirements?.length" class="text-sm text-slate-500 italic py-4">
                No courses available
              </div>

              <div v-for="requirement in curriculumDetail?.requirements" :key="requirement.id" class="flex flex-col gap-2">
                <button
                  @click="toggleRequirementCourses(requirement.id)"
                  class="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition flex justify-between items-center"
                >
                  <span>{{ requirement.name }} ({{ requirement.courses?.length || 0 }} courses)</span>
                  <span>{{ expandedRequirementCourses[requirement.id] ? '▼' : '▶' }}</span>
                </button>

                <div v-if="expandedRequirementCourses[requirement.id]" class="pl-4 space-y-2 border-l-2 border-slate-300">
                  <div v-if="requirement.courses?.length === 0" class="text-xs text-slate-500 italic">
                    No courses in this requirement
                  </div>

                  <div v-for="course in requirement.courses" :key="course.id" class="flex gap-2 bg-white p-2 rounded border border-slate-200">
                    <input
                      :value="course.course.course_code"
                      @input="updateCourse(requirement.id, course.id, { course_code: ($event.target as HTMLInputElement).value })"
                      placeholder="Code"
                      class="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                    />
                    <input
                      :value="course.course.course_title"
                      @input="updateCourse(requirement.id, course.id, { course_title: ($event.target as HTMLInputElement).value })"
                      placeholder="Course name"
                      class="flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                    />
                    <button
                      @click="deleteCourse(requirement.id, course.id)"
                      class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>

                  <button
                    @click="addCourseToRequirement(requirement.id)"
                    class="text-xs bg-[#0d2b0f] text-white px-3 py-1 rounded hover:bg-[#1b5e20] transition"
                  >
                    + Add Course
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Program Study Plan -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-[#164d23] border-b-2 border-[#164d23] pb-2">
              Program Study Plan
            </h3>

            <div v-if="studyPlanGrouped.length === 0" class="text-sm text-slate-500 italic py-4">
              No study plan data available
            </div>

            <div v-else class="overflow-x-auto">
              <div v-for="yearData in studyPlanGrouped" :key="yearData.year" class="mb-6">
                <h4 class="text-sm font-semibold text-slate-700 mb-3">Year {{ yearData.year }}</h4>

                <div v-for="semesterData in yearData.semesters" :key="semesterData.semester" class="mb-4">
                  <h5 class="text-xs font-semibold text-slate-600 mb-2 ml-2">Semester {{ semesterData.semester }}</h5>

                  <table class="w-full text-sm border-collapse">
                    <thead>
                      <tr class="bg-slate-200">
                        <th class="border border-slate-300 px-3 py-2 text-left">Course Code</th>
                        <th class="border border-slate-300 px-3 py-2 text-left">Course Title</th>
                        <th class="border border-slate-300 px-3 py-2 text-center w-24">Edit</th>
                        <th class="border border-slate-300 px-3 py-2 text-center w-24">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="course in semesterData.courses" :key="course.id" class="hover:bg-slate-50">
                        <td class="border border-slate-300 px-3 py-2">
                          <span v-if="!editingCourse || editingCourse.id !== course.id" class="text-slate-700">
                            {{ course.course.course_code }}
                          </span>
                          <input
                            v-else
                            v-model="editingCourse.course_code"
                            class="w-full rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                          />
                        </td>
                        <td class="border border-slate-300 px-3 py-2">
                          <span v-if="!editingCourse || editingCourse.id !== course.id" class="text-slate-700">
                            {{ course.course.course_title }}
                          </span>
                          <input
                            v-else
                            v-model="editingCourse.course_title"
                            class="w-full rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                          />
                        </td>
                        <td class="border border-slate-300 px-3 py-2 text-center">
                          <button
                            v-if="!editingCourse || editingCourse.id !== course.id"
                            @click="startEditingStudyPlanCourse(course)"
                            class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            v-else
                            @click="saveEditingStudyPlanCourse"
                            class="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                          >
                            Save
                          </button>
                        </td>
                        <td class="border border-slate-300 px-3 py-2 text-center">
                          <button
                            @click="deleteStudyPlanCourse(course.id)"
                            class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <button
              @click="addStudyPlanCourse"
              class="w-fit rounded-lg bg-[#0d2b0f] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
            >
              + Add Study Plan Course
            </button>
          </div>

          <!-- Save Changes Button -->
          <button
            @click="saveChanges"
            :disabled="isSaving || !hasChanges"
            class="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import {
  getCurriculumDetailByProgramId,
  getCollegesWithIds,
  getProgramsByCollegeId,
  updateCurriculum,
  createCurriculumRequirement,
  updateCurriculumRequirement,
  deleteCurriculumRequirement,
  createCurriculumCourse,
  deleteCurriculumCourse,
  getOrCreateCourse,
  createStudyPlanEntry,
  updateStudyPlanEntry,
  deleteStudyPlanEntry,
} from '@/services/curriculumService'
import type {
  CurriculumDetail,
  CurriculumRequirement,
  StudyPlanItem,
} from '@/types/Curriculum'

// State
const colleges = ref<Array<{ id: string; code: string; name: string }>>([])
const programs = ref<Array<{ id: string; name: string; code?: string }>>([])

const selectedCollege = ref('')
const selectedProgram = ref('')
const curriculumForm = ref({
  revision_no: '',
  legal_basis: '',
  effectivity_term: '',
  description: '',
})

const curriculumDetail = ref<CurriculumDetail | null>(null)
const isLoadingCurriculum = ref(false)
const isSaving = ref(false)

const expandedRequirements = ref<Record<string, boolean>>({})
const expandedRequirementCourses = ref<Record<string, boolean>>({})
const editingCourse = ref<{ id: string; course_code: string; course_title: string } | null>(null)

const hasChanges = ref(false)

// Track changes for differential saves
const requirementChanges = ref<{
  created: Array<{ name: string; description?: string; display_order?: number }>
  updated: Array<{ id: string; name: string; description?: string }>
  deleted: string[]
}>({
  created: [],
  updated: [],
  deleted: [],
})

const courseChanges = ref<{
  created: Array<{ requirement_id: string; course_code: string; course_title: string; display_order?: number }>
  deleted: string[]
}>({
  created: [],
  deleted: [],
})

const studyPlanChanges = ref<{
  created: Array<{ course_code: string; course_title: string; year_level: number; semester: number; display_order?: number }>
  updated: Array<{ id: string; course_code: string; course_title: string; year_level: number; semester: number }>
  deleted: string[]
}>({
  created: [],
  updated: [],
  deleted: [],
})

// Computed
const filteredPrograms = computed(() => programs.value)

const studyPlanGrouped = computed(() => {
  const plan = curriculumDetail.value?.study_plan
  if (!plan) return []

  const grouped: Record<number, Record<number, StudyPlanItem[]>> = {}

  for (const item of plan) {
    const year = item.year_level
    const sem = item.semester
    if (!grouped[year]) {
      grouped[year] = {}
    }
    if (!grouped[year][sem]) {
      grouped[year][sem] = []
    }
    grouped[year][sem].push(item)
  }

  return Object.entries(grouped)
    .map(([year, semesters]) => ({
      year: parseInt(year),
      semesters: Object.entries(semesters)
        .map(([semester, courses]) => ({
          semester: parseInt(semester),
          courses,
        }))
        .sort((a, b) => a.semester - b.semester),
    }))
    .sort((a, b) => a.year - b.year)
})

// Methods
const loadColleges = async () => {
  try {
    colleges.value = await getCollegesWithIds()
  } catch (error) {
    console.error('Error loading colleges:', error)
  }
}

const onCollegeChange = async () => {
  if (!selectedCollege.value) {
    programs.value = []
    selectedProgram.value = ''
    return
  }

  try {
    programs.value = await getProgramsByCollegeId(selectedCollege.value)
    selectedProgram.value = ''
    curriculumDetail.value = null
    curriculumForm.value = {
      revision_no: '',
      legal_basis: '',
      effectivity_term: '',
      description: '',
    }
  } catch (error) {
    console.error('Error loading programs:', error)
  }
}

const onProgramChange = async () => {
  if (!selectedProgram.value) return

  isLoadingCurriculum.value = true
  try {
    const detail = await getCurriculumDetailByProgramId(selectedProgram.value)

    if (detail) {
      curriculumDetail.value = detail
      curriculumForm.value = {
        revision_no: detail.revision_no || '',
        legal_basis: detail.legal_basis || '',
        effectivity_term: detail.effectivity_term || '',
        description: detail.description || '',
      }

      expandedRequirements.value = {}
      expandedRequirementCourses.value = {}
    } else {
      curriculumDetail.value = {
        id: '',
        program_id: selectedProgram.value,
        revision_year: null,
        revision_no: null,
        legal_basis: null,
        effectivity_term: null,
        description: null,
        requirements: [],
        study_plan: [],
      }
      curriculumForm.value = {
        revision_no: '',
        legal_basis: '',
        effectivity_term: '',
        description: '',
      }
    }

    resetChanges()
  } catch (error) {
    console.error('Error loading curriculum:', error)
  } finally {
    isLoadingCurriculum.value = false
  }
}

const resetChanges = () => {
  requirementChanges.value = { created: [], updated: [], deleted: [] }
  courseChanges.value = { created: [], deleted: [] }
  studyPlanChanges.value = { created: [], updated: [], deleted: [] }
  hasChanges.value = false
}

const toggleRequirement = (requirementId: string) => {
  expandedRequirements.value[requirementId] = !expandedRequirements.value[requirementId]
}

const toggleRequirementCourses = (requirementId: string) => {
  expandedRequirementCourses.value[requirementId] = !expandedRequirementCourses.value[requirementId]
}

const updateRequirement = (requirementId: string, updates: Partial<CurriculumRequirement>) => {
  if (!curriculumDetail.value?.requirements) return

  const requirement = curriculumDetail.value.requirements.find((r) => r.id === requirementId)
  if (requirement) {
    Object.assign(requirement, updates)
    if (!requirementId.startsWith('new-')) {
      const existing = requirementChanges.value.updated.find((r) => r.id === requirementId)
      if (existing) {
        existing.name = updates.name || existing.name
        existing.description = updates.description ?? existing.description
      } else {
        requirementChanges.value.updated.push({
          id: requirementId,
          name: updates.name || '',
          description: updates.description,
        })
      }
    }
    hasChanges.value = true
  }
}

const deleteRequirement = (requirementId: string) => {
  if (!curriculumDetail.value?.requirements) return

  const index = curriculumDetail.value.requirements.findIndex((r) => r.id === requirementId)
  if (index > -1) {
    curriculumDetail.value.requirements.splice(index, 1)
    delete expandedRequirements.value[requirementId]

    if (requirementId.startsWith('new-')) {
      requirementChanges.value.created = requirementChanges.value.created.filter((r) => r !== undefined)
    } else {
      requirementChanges.value.deleted.push(requirementId)
    }
    hasChanges.value = true
  }
}

const addRequirement = () => {
  if (!curriculumDetail.value) return

  const newRequirement: CurriculumRequirement = {
    id: `new-${Date.now()}`,
    name: 'New Requirement',
    description: '',
    display_order: (curriculumDetail.value.requirements?.length || 0) + 1,
    courses: [],
  }

  if (!curriculumDetail.value.requirements) {
    curriculumDetail.value.requirements = []
  }

  curriculumDetail.value.requirements.push(newRequirement)
  requirementChanges.value.created.push({
    name: newRequirement.name,
    description: newRequirement.description,
    display_order: newRequirement.display_order,
  })
  expandedRequirements.value[newRequirement.id] = true
  hasChanges.value = true
}

const updateCourse = (
  requirementId: string,
  courseId: string,
  updates: Partial<{ course_code: string; course_title: string }>,
) => {
  if (!curriculumDetail.value?.requirements) return

  const requirement = curriculumDetail.value.requirements.find((r) => r.id === requirementId)
  if (requirement) {
    const course = requirement.courses.find((c) => c.id === courseId)
    if (course) {
      if (updates.course_code) course.course.course_code = updates.course_code
      if (updates.course_title) course.course.course_title = updates.course_title
      hasChanges.value = true
    }
  }
}

const deleteCourse = (requirementId: string, courseId: string) => {
  if (!curriculumDetail.value?.requirements) return

  const requirement = curriculumDetail.value.requirements.find((r) => r.id === requirementId)
  if (requirement) {
    const index = requirement.courses.findIndex((c) => c.id === courseId)
    if (index > -1) {
      requirement.courses.splice(index, 1)
      if (!courseId.startsWith('new-')) {
        courseChanges.value.deleted.push(courseId)
      }
      hasChanges.value = true
    }
  }
}

const addCourseToRequirement = (requirementId: string) => {
  if (!curriculumDetail.value?.requirements) return

  const requirement = curriculumDetail.value.requirements.find((r) => r.id === requirementId)
  if (requirement) {
    const newCourse = {
      id: `new-course-${Date.now()}`,
      display_order: (requirement.courses?.length || 0) + 1,
      course: {
        id: `new-course-id-${Date.now()}`,
        course_code: '',
        course_title: '',
      },
    }

    requirement.courses.push(newCourse)
    courseChanges.value.created.push({
      requirement_id: requirementId,
      course_code: '',
      course_title: '',
      display_order: newCourse.display_order,
    })
    hasChanges.value = true
  }
}

const startEditingStudyPlanCourse = (course: StudyPlanItem) => {
  editingCourse.value = {
    id: course.id,
    course_code: course.course.course_code,
    course_title: course.course.course_title,
  }
}

const saveEditingStudyPlanCourse = () => {
  if (!editingCourse.value || !curriculumDetail.value?.study_plan) return

  const course = curriculumDetail.value.study_plan.find((c) => c.id === editingCourse.value!.id)
  if (course) {
    const existing = studyPlanChanges.value.updated.find((c) => c.id === editingCourse.value!.id)
    if (existing) {
      existing.course_code = editingCourse.value.course_code
      existing.course_title = editingCourse.value.course_title
    } else if (!editingCourse.value.id.startsWith('new-')) {
      studyPlanChanges.value.updated.push({
        id: editingCourse.value.id,
        course_code: editingCourse.value.course_code,
        course_title: editingCourse.value.course_title,
        year_level: course.year_level,
        semester: course.semester,
      })
    }

    course.course.course_code = editingCourse.value.course_code
    course.course.course_title = editingCourse.value.course_title
    hasChanges.value = true
  }

  editingCourse.value = null
}

const deleteStudyPlanCourse = (courseId: string) => {
  if (!curriculumDetail.value?.study_plan) return

  const index = curriculumDetail.value.study_plan.findIndex((c) => c.id === courseId)
  if (index > -1) {
    curriculumDetail.value.study_plan.splice(index, 1)
    if (!courseId.startsWith('new-')) {
      studyPlanChanges.value.deleted.push(courseId)
    }
    hasChanges.value = true
  }
}

const addStudyPlanCourse = () => {
  if (!curriculumDetail.value) {
    curriculumDetail.value = {
      id: '',
      program_id: selectedProgram.value,
      revision_year: null,
      revision_no: null,
      legal_basis: null,
      effectivity_term: null,
      description: null,
      requirements: [],
      study_plan: [],
    }
  }

  const newCourse: StudyPlanItem = {
    id: `new-study-${Date.now()}`,
    year_level: 1,
    semester: 1,
    display_order: (curriculumDetail.value.study_plan?.length || 0) + 1,
    course: {
      id: `course-${Date.now()}`,
      course_code: '',
      course_title: '',
    },
  }

  if (!curriculumDetail.value.study_plan) {
    curriculumDetail.value.study_plan = []
  }

  curriculumDetail.value.study_plan.push(newCourse)
  studyPlanChanges.value.created.push({
    course_code: '',
    course_title: '',
    year_level: 1,
    semester: 1,
    display_order: newCourse.display_order,
  })
  hasChanges.value = true
}

const saveChanges = async () => {
  if (!selectedProgram.value || !curriculumDetail.value) return

  isSaving.value = true
  try {
    // Update curriculum basic info
    if (curriculumDetail.value.id) {
      await updateCurriculum(curriculumDetail.value.id, {
        revision_no: curriculumForm.value.revision_no,
        legal_basis: curriculumForm.value.legal_basis,
        effectivity_term: curriculumForm.value.effectivity_term,
        description: curriculumForm.value.description,
      } as any)
    }

    // Save requirement changes
    for (const req of requirementChanges.value.created) {
      if (curriculumDetail.value.id) {
        await createCurriculumRequirement(curriculumDetail.value.id, req.name, req.description, req.display_order)
      }
    }

    for (const req of requirementChanges.value.updated) {
      await updateCurriculumRequirement(req.id, req.name, req.description)
    }

    for (const reqId of requirementChanges.value.deleted) {
      await deleteCurriculumRequirement(reqId)
    }

    // Save course changes (in requirements)
    for (const course of courseChanges.value.created) {
      const courseId = await getOrCreateCourse(course.course_code, course.course_title)
      await createCurriculumCourse(course.requirement_id, courseId, course.display_order)
    }

    for (const courseId of courseChanges.value.deleted) {
      await deleteCurriculumCourse(courseId)
    }

    // Save study plan changes
    for (const plan of studyPlanChanges.value.created) {
      const courseId = await getOrCreateCourse(plan.course_code, plan.course_title)
      if (curriculumDetail.value.id) {
        await createStudyPlanEntry(curriculumDetail.value.id, courseId, plan.year_level, plan.semester, plan.display_order)
      }
    }

    for (const plan of studyPlanChanges.value.updated) {
      const courseId = await getOrCreateCourse(plan.course_code, plan.course_title)
      await updateStudyPlanEntry(plan.id, courseId, plan.year_level, plan.semester)
    }

    for (const planId of studyPlanChanges.value.deleted) {
      await deleteStudyPlanEntry(planId)
    }

    alert('Changes saved successfully!')
    resetChanges()

    // Reload to get fresh data
    await onProgramChange()
  } catch (error) {
    console.error('Error saving changes:', error)
    alert(`Error saving changes: ${(error as Error).message}`)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadColleges()
})
</script>

<style scoped>
.header-sub {
  font-size: 0.88rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 20px;
  animation: fadeIn 0.6s ease 0.55s both;
}
</style>
