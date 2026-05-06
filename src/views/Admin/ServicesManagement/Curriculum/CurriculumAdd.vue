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
            Create a new curriculum information to share with the academic community.
          </p>
        </div>
      </header>

      <!-- Add College Modal -->
      <div v-if="showAddCollegeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 class="text-lg font-bold mb-4 text-[#164d23]">Add New College</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">College Code</label>
              <input
                v-model="newCollege.code"
                type="text"
                placeholder="e.g., CCIS"
                class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">College Name</label>
              <input
                v-model="newCollege.name"
                type="text"
                placeholder="e.g., College of Computing and Information Sciences"
                class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
            <div class="flex gap-2 justify-end">
              <button
                @click="showAddCollegeModal = false"
                class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                @click="saveNewCollege"
                :disabled="!newCollege.code || !newCollege.name"
                class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add College
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Program Modal -->
      <div v-if="showAddProgramModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 class="text-lg font-bold mb-4 text-[#164d23]">Add New Program</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">Program Code</label>
              <input
                v-model="newProgram.program_code"
                type="text"
                placeholder="e.g., BSCS"
                class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">Program Name</label>
              <input
                v-model="newProgram.program_name"
                type="text"
                placeholder="e.g., Bachelor of Science in Computer Science"
                class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              />
            </div>
            <div>
              <label class="text-xs font-semibold uppercase text-slate-500">Level</label>
              <select
                v-model="newProgram.level"
                class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              >
                <option value="">Select Level...</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
            <div class="flex gap-2 justify-end">
              <button
                @click="showAddProgramModal = false"
                class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                @click="saveNewProgram"
                :disabled="!newProgram.program_code || !newProgram.program_name || !newProgram.level"
                class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Program
              </button>
            </div>
          </div>
        </div>
      </div>

      <section
        class="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm mt-6"
      >
        <!-- Error Alert -->
        <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p class="text-sm text-green-700">{{ successMessage }}</p>
        </div>

        <!-- College and Program dropdowns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">College</label>
            <div class="flex gap-2">
              <select
                v-model="selectedCollegeId"
                @change="onCollegeChange"
                class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              >
                <option value="">Select College...</option>
                <option v-for="college in colleges" :key="college.id" :value="college.id">
                  {{ college.code }} - {{ college.name }}
                </option>
              </select>
              <button
                @click="showAddCollegeModal = true"
                class="rounded-lg bg-[#0d2b0f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1b5e20]"
              >
                +
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Program</label>
            <div class="flex gap-2">
              <select
                v-model="selectedProgramId"
                @change="onProgramChange"
                class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
              >
                <option value="">Select Program...</option>
                <option v-for="program in filteredPrograms" :key="program.id" :value="program.id">
                  {{ program.program_name }}
                </option>
              </select>
              <button
                @click="showAddProgramModal = true"
                :disabled="!selectedCollegeId"
                class="rounded-lg bg-[#0d2b0f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Specialization Selection (if program has specializations) -->
        <div v-if="specializations.length > 0" class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Program Specialization (Optional - if none selected, curriculum is for main program)
          </label>
          <select
            v-model="selectedSpecializationId"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
          >
            <option value="">Curriculum for Main Program</option>
            <option v-for="spec in specializations" :key="spec.id" :value="spec.id">
              {{ spec.program_sp_name }}
            </option>
          </select>
        </div>

        <!-- Revision Year -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Revision Year</label>
          <input
            v-model.number="form.revisionYear"
            type="number"
            placeholder="e.g., 2024"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
          />
        </div>

        <!-- Revision No, Legal Basis, Effectivity -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Revision No.</label>
            <input
              v-model="form.revisionNo"
              type="text"
              placeholder="e.g., 1.0"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal Basis</label>
            <input
              v-model="form.legalBasis"
              type="text"
              placeholder="e.g., CMO or Board Resolution"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Effectivity</label>
            <input
              v-model="form.effectivityTerm"
              type="text"
              placeholder="e.g., A.Y. 2024-2025"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Enter curriculum description..."
            rows="4"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"
          ></textarea>
        </div>

        <!-- Requirements Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left: Requirements to Complete the Degree -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-[#164d23]">
              Requirements to Complete the Degree
            </h3>

            <div v-for="(req, idx) in form.requirements" :key="idx" class="flex flex-col gap-2">
              <h4 class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white">
                Requirement {{ idx + 1 }}
              </h4>
              <div class="flex gap-2">
                <input
                  v-model="req.name"
                  type="text"
                  placeholder="Enter requirement name..."
                  class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                />
                <button
                  @click="removeRequirement(idx)"
                  class="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
              <textarea
                v-model="req.description"
                placeholder="Enter requirement description..."
                rows="2"
                class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"
              ></textarea>
            </div>

            <button
              @click="addRequirement"
              class="w-fit rounded-lg bg-[#0d2b0f] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
            >
              Add Requirement
            </button>
          </div>

          <!-- Right: Course Requirements -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-bold uppercase tracking-wide text-[#164d23]">Courses by Requirement</h3>

            <div v-for="(req, idx) in form.requirements" :key="`courses-${idx}`" class="flex flex-col gap-2">
              <h4 class="rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white">
                {{ req.name || `Requirement ${idx + 1}` }}
              </h4>

              <div v-for="(course, cIdx) in req.courses" :key="cIdx" class="flex flex-col gap-2 pl-4 border-l-2 border-[#164d23]">
                <div class="flex gap-2">
                  <input
                    v-model="course.course_title"
                    type="text"
                    placeholder="Course Name"
                    class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                  />
                  <input
                    v-model="course.course_code"
                    type="text"
                    placeholder="Code"
                    class="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]"
                  />
                  <button
                    @click="removeCourse(idx, cIdx)"
                    class="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              </div>

              <button
                @click="addCourse(idx)"
                class="w-fit rounded-lg bg-[#0d2b0f] px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#1b5e20]"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex gap-4 justify-end">
          <button
            @click="$router.push('/admin/services/curriculum')"
            class="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            @click="saveCurriculum"
            :disabled="isSaving || !selectedProgramId"
            class="rounded-lg bg-[#164d23] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#0d2b0f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving...' : 'Save Curriculum' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

const router = useRouter()

interface College {
  id: string
  code: string
  name: string
}

interface Program {
  id: string
  program_name: string
  college_id: string
}

interface Specialization {
  id: string
  program_sp_name: string | null
  program_id: string
}

interface Course {
  course_title: string
  course_code: string
}

interface Requirement {
  name: string
  description: string
  courses: Course[]
}

interface FormData {
  revisionYear: number | null
  revisionNo: string
  legalBasis: string
  effectivityTerm: string
  description: string
  requirements: Requirement[]
}

const colleges = ref<College[]>([])
const programs = ref<Program[]>([])
const specializations = ref<Specialization[]>([])
const selectedCollegeId = ref<string>('')
const selectedProgramId = ref<string>('')
const selectedSpecializationId = ref<string>('')
const isSaving = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const showAddCollegeModal = ref(false)
const showAddProgramModal = ref(false)

const newCollege = ref({ code: '', name: '' })
const newProgram = ref({ program_code: '', program_name: '', level: '' })

const form = ref<FormData>({
  revisionYear: null,
  revisionNo: '',
  legalBasis: '',
  effectivityTerm: '',
  description: '',
  requirements: [],
})

const filteredPrograms = computed(() =>
  programs.value.filter((p) => p.college_id === selectedCollegeId.value),
)

const fetchColleges = async () => {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, code, name')
      .order('code', { ascending: true })

    if (error) throw error
    colleges.value = data || []
  } catch (error) {
    console.error('Error fetching colleges:', error)
    errorMessage.value = 'Failed to load colleges'
  }
}

const fetchPrograms = async () => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('id, program_name, college_id')
      .order('program_name', { ascending: true })

    if (error) throw error
    programs.value = data || []
  } catch (error) {
    console.error('Error fetching programs:', error)
    errorMessage.value = 'Failed to load programs'
  }
}

const fetchSpecializations = async (programId: string) => {
  try {
    const { data, error } = await supabase
      .from('program_specializations')
      .select('id, program_sp_name, program_id')
      .eq('program_id', programId)
      .order('program_sp_name', { ascending: true })

    if (error) throw error
    specializations.value = data || []
  } catch (error) {
    console.error('Error fetching specializations:', error)
    specializations.value = []
  }
}

const onCollegeChange = () => {
  selectedProgramId.value = ''
  selectedSpecializationId.value = ''
  specializations.value = []
}

const onProgramChange = () => {
  selectedSpecializationId.value = ''
  if (selectedProgramId.value) {
    fetchSpecializations(selectedProgramId.value)
  } else {
    specializations.value = []
  }
}

const saveNewCollege = async () => {
  try {
    errorMessage.value = ''

    if (!newCollege.value.code || !newCollege.value.name) {
      errorMessage.value = 'College code and name are required'
      return
    }

    const { data, error } = await supabase
      .from('colleges')
      .insert([
        {
          code: newCollege.value.code,
          name: newCollege.value.name,
        },
      ])
      .select()
      .single()

    if (error) throw error

    colleges.value.push(data)
    selectedCollegeId.value = data.id
    newCollege.value = { code: '', name: '' }
    showAddCollegeModal.value = false
    successMessage.value = 'College added successfully'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('Error creating college:', error)
    errorMessage.value = 'Failed to create college. Code might already exist.'
  }
}

const saveNewProgram = async () => {
  try {
    errorMessage.value = ''

    if (!selectedCollegeId.value || !newProgram.value.program_code || !newProgram.value.program_name || !newProgram.value.level) {
      errorMessage.value = 'All program fields are required'
      return
    }

    const { data, error } = await supabase
      .from('programs')
      .insert([
        {
          college_id: selectedCollegeId.value,
          program_code: newProgram.value.program_code,
          program_name: newProgram.value.program_name,
          level: newProgram.value.level,
        },
      ])
      .select()
      .single()

    if (error) throw error

    programs.value.push(data)
    selectedProgramId.value = data.id
    newProgram.value = { program_code: '', program_name: '', level: '' }
    showAddProgramModal.value = false
    successMessage.value = 'Program added successfully'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)

    await fetchSpecializations(data.id)
  } catch (error) {
    console.error('Error creating program:', error)
    errorMessage.value = 'Failed to create program. Please try again.'
  }
}

const addRequirement = () => {
  form.value.requirements.push({
    name: '',
    description: '',
    courses: [],
  })
}

const removeRequirement = (index: number) => {
  form.value.requirements.splice(index, 1)
}

const addCourse = (requirementIndex: number) => {
  const req = form.value.requirements[requirementIndex]
  if (req) {
    req.courses.push({
      course_title: '',
      course_code: '',
    })
  }
}

const removeCourse = (requirementIndex: number, courseIndex: number) => {
  const req = form.value.requirements[requirementIndex]
  if (req) {
    req.courses.splice(courseIndex, 1)
  }
}

const saveCurriculum = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''

    if (!selectedProgramId.value) {
      errorMessage.value = 'Please select a program'
      return
    }

    isSaving.value = true

    // Determine whether to save for program or specialization
    const programId = selectedSpecializationId.value ? null : selectedProgramId.value
    const specializationId = selectedSpecializationId.value || null

    // Create curriculum entry
    const { data: curriculumData, error: curriculumError } = await supabase
      .from('curricula')
      .insert([
        {
          program_id: programId,
          program_specialization_id: specializationId,
          revision_year: form.value.revisionYear,
          revision_no: form.value.revisionNo || null,
          legal_basis: form.value.legalBasis || null,
          effectivity_term: form.value.effectivityTerm || null,
          description: form.value.description || null,
        },
      ])
      .select()
      .single()

    if (curriculumError) throw curriculumError

    const curriculumId = curriculumData?.id
    if (!curriculumId) throw new Error('Failed to create curriculum')

    // Save requirements and courses
    for (let reqIdx = 0; reqIdx < form.value.requirements.length; reqIdx++) {
      const req = form.value.requirements[reqIdx]
      if (!req) continue

      const { data: requirementData, error: requirementError } = await supabase
        .from('curriculum_requirements')
        .insert([
          {
            curriculum_id: curriculumId,
            name: req.name || `Requirement ${reqIdx + 1}`,
            description: req.description || null,
            display_order: reqIdx,
          },
        ])
        .select()
        .single()

      if (requirementError) throw requirementError

      const requirementId = requirementData?.id
      if (!requirementId) throw new Error('Failed to create requirement')

      // Save courses for this requirement
      for (let cIdx = 0; cIdx < req.courses.length; cIdx++) {
        const course = req.courses[cIdx]
        if (!course) continue

        if (!course.course_title.trim()) continue

        // Create or get course
        const courseCode = course.course_code?.trim() || null
        const { data: existingCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('course_code', courseCode)
          .maybeSingle()

        let courseId: string

        if (existingCourse) {
          courseId = existingCourse.id
        } else {
          const { data: newCourse, error: courseError } = await supabase
            .from('courses')
            .insert([
              {
                course_code: courseCode,
                course_title: course.course_title,
              },
            ])
            .select()
            .single()

          if (courseError) throw courseError
          courseId = newCourse?.id
          if (!courseId) throw new Error('Failed to create course')
        }

        // Link course to requirement
        const { error: linkError } = await supabase
          .from('curriculum_courses')
          .insert([
            {
              requirement_id: requirementId,
              course_id: courseId,
              display_order: cIdx,
            },
          ])

        if (linkError) throw linkError
      }
    }

    successMessage.value = 'Curriculum saved successfully!'
    setTimeout(() => {
      router.push('/admin/services/curriculum')
    }, 1500)
  } catch (error) {
    console.error('Error saving curriculum:', error)
    errorMessage.value = 'Failed to save curriculum. Please try again.'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchColleges()
  fetchPrograms()
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
