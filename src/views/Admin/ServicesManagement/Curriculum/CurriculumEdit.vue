<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f5f3ef]">
    <Sidebar :activeTab="'SERVICES'"></Sidebar>

    <main class="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
      <!-- Header -->
      <header class="mb-6">
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          <span class="cursor-pointer hover:text-[#164d23] transition-colors" @click="$router.push('/admin/services/curriculum')">
            Curriculum
          </span>
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
          <span class="text-[#164d23]">Edit Curriculum</span>
        </div>
        <h1 class="text-3xl font-black tracking-tight text-[#0d2b0f]">
          Edit Curriculum
          <span class="text-yellow-500">Record</span>
        </h1>
        <p class="text-sm text-slate-500 mt-1">Update curriculum details, requirements, courses, and the program study plan.</p>
      </header>

      <!-- Toast -->
      <transition name="toast">
        <div v-if="toastMessage" :class="['fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-xl text-sm font-semibold',
          toastType === 'error' ? 'bg-red-600 text-white' : 'bg-[#164d23] text-white']">
          <svg v-if="toastType === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ toastMessage }}
        </div>
      </transition>

      <!-- Add Course to Requirement Modal -->
      <transition name="modal">
        <div v-if="showAddCourseModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 class="text-base font-black text-[#164d23] mb-1 uppercase tracking-wide">Add Course</h2>
            <p class="text-xs text-slate-400 mb-4">Adding to: <span class="font-semibold text-slate-600">{{ addCourseTarget?.reqName }}</span></p>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Course Code</label>
                <input v-model="addCourseForm.course_code" type="text" placeholder="e.g., CS101"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Course Title</label>
                <input v-model="addCourseForm.course_title" type="text" placeholder="e.g., Introduction to Computing"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div class="flex gap-2 pt-1">
                <button @click="showAddCourseModal = false"
                  class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button @click="confirmAddCourse" :disabled="!addCourseForm.course_title || isSavingCourse"
                  class="flex-1 rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50 flex items-center justify-center gap-2">
                  <svg v-if="isSavingCourse" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ isSavingCourse ? 'Adding...' : 'Add Course' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Add Requirement Modal -->
      <transition name="modal">
        <div v-if="showAddRequirementModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 class="text-base font-black text-[#164d23] mb-4 uppercase tracking-wide">Add Requirement</h2>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Name</label>
                <input v-model="addReqForm.name" type="text" placeholder="e.g., Core Courses"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Description <span class="text-slate-300 font-normal normal-case">(optional)</span></label>
                <textarea v-model="addReqForm.description" rows="2" placeholder="Describe what this requirement covers..."
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"></textarea>
              </div>
              <div class="flex gap-2 pt-1">
                <button @click="showAddRequirementModal = false"
                  class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button @click="confirmAddRequirement" :disabled="!addReqForm.name || isSavingReq"
                  class="flex-1 rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50 flex items-center justify-center gap-2">
                  <svg v-if="isSavingReq" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ isSavingReq ? 'Adding...' : 'Add Requirement' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Add Study Plan Course Modal -->
      <transition name="modal">
        <div v-if="showAddStudyPlanModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 class="text-base font-black text-[#164d23] mb-1 uppercase tracking-wide">Add to Study Plan</h2>
            <p class="text-xs text-slate-400 mb-4">Specify the year, semester, and course details. Course code will be matched or created.</p>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Year Level</label>
                  <select v-model.number="addStudyPlanForm.year_level"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                    <option :value="1">Year 1</option>
                    <option :value="2">Year 2</option>
                    <option :value="3">Year 3</option>
                    <option :value="4">Year 4</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Semester</label>
                  <select v-model.number="addStudyPlanForm.semester"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                    <option :value="1">Semester 1</option>
                    <option :value="2">Semester 2</option>
                    <option :value="3">Summer</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Course Code</label>
                <input v-model="addStudyPlanForm.course_code" type="text" placeholder="e.g., CS101"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Course Title</label>
                <input v-model="addStudyPlanForm.course_title" type="text" placeholder="e.g., Data Structures"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Type <span class="text-slate-300 normal-case font-normal">(optional)</span></label>
                <input v-model="addStudyPlanForm.type" type="text" placeholder="e.g., Core, Elective, GE"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div class="flex gap-2 pt-1">
                <button @click="showAddStudyPlanModal = false"
                  class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button @click="confirmAddStudyPlan" :disabled="!addStudyPlanForm.course_title || isSavingStudyPlan"
                  class="flex-1 rounded-lg bg-[#0d2b0f] px-4 py-2 text-sm font-bold text-white hover:bg-[#164d23] disabled:opacity-50 flex items-center justify-center gap-2">
                  <svg v-if="isSavingStudyPlan" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ isSavingStudyPlan ? 'Adding...' : 'Add to Plan' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="max-w-5xl mx-auto space-y-5 pb-12">

        <!-- ① PROGRAM SELECTOR -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="bg-[#0d2b0f] px-6 py-3.5 flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-widest text-yellow-400">01</span>
            <span class="text-sm font-bold text-white uppercase tracking-wider">Select Program</span>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">College</label>
              <select v-model="selectedCollegeId" @change="onCollegeChange"
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                <option value="">Select college...</option>
                <option v-for="c in colleges" :key="c.id" :value="c.id">{{ c.code }} – {{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Program / Specialization</label>
              <select v-model="selectedProgramOrSpecId" @change="onProgramChange" :disabled="!selectedCollegeId"
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] disabled:opacity-50">
                <option value="">Select program...</option>
                <optgroup v-for="group in programOptions" :key="group.label" :label="group.label">
                  <option v-for="opt in group.options" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex items-center justify-center gap-3">
          <svg class="w-5 h-5 animate-spin text-[#164d23]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm text-slate-500 font-medium">Loading curriculum data…</span>
        </div>

        <!-- No curriculum found -->
        <div v-else-if="selectedProgramOrSpecId && !curriculumId && !isLoading"
          class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p class="text-sm font-semibold text-amber-700">No curriculum found for this program.</p>
          <p class="text-xs text-amber-600 mt-1">Create one using <strong>Add Curriculum</strong>.</p>
        </div>

        <template v-if="curriculumId && !isLoading">

          <!-- ② CURRICULUM DETAILS -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="bg-[#164d23] px-6 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase tracking-widest text-yellow-400">02</span>
                <span class="text-sm font-bold text-white uppercase tracking-wider">Curriculum Details</span>
              </div>
              <button v-if="detailsDirty" @click="saveDetails" :disabled="isSavingDetails"
                class="text-xs font-bold bg-yellow-400 text-[#0d2b0f] px-4 py-1.5 rounded-lg hover:bg-yellow-300 transition flex items-center gap-1.5 disabled:opacity-60">
                <svg v-if="isSavingDetails" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSavingDetails ? 'Saving…' : '↑ Save Details' }}
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Revision Year</label>
                  <input v-model.number="detailsForm.revision_year" type="number" placeholder="2024" @input="detailsDirty = true"
                    class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Revision No.</label>
                  <input v-model="detailsForm.revision_no" type="text" placeholder="1.0" @input="detailsDirty = true"
                    class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Legal Basis</label>
                  <input v-model="detailsForm.legal_basis" type="text" placeholder="CMO No. XX" @input="detailsDirty = true"
                    class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Effectivity</label>
                  <input v-model="detailsForm.effectivity_term" type="text" placeholder="A.Y. 2024-2025" @input="detailsDirty = true"
                    class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
                <textarea v-model="detailsForm.description" rows="3" @input="detailsDirty = true"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- ③ REQUIREMENTS & COURSES -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="bg-[#1b5e20] px-6 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase tracking-widest text-yellow-400">03</span>
                <span class="text-sm font-bold text-white uppercase tracking-wider">Requirements &amp; Courses</span>
              </div>
              <button @click="openAddRequirementModal"
                class="text-xs font-bold bg-white/10 text-white px-4 py-1.5 rounded-lg hover:bg-white/20 transition border border-white/20">
                + Add Requirement
              </button>
            </div>
            <div class="p-6">
              <div v-if="!requirements.length" class="text-center py-8 text-slate-400">
                <p class="text-sm font-medium">No requirements defined</p>
                <p class="text-xs mt-1">Add requirements to specify courses needed to complete the degree.</p>
              </div>

              <div class="space-y-4">
                <div v-for="req in requirements" :key="req.id" class="rounded-xl border border-slate-200 overflow-hidden">
                  <!-- Req header – editable inline -->
                  <div class="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-[#1b5e20] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {{ req.display_order ?? '' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <input v-if="editingReqId === req.id" v-model="req._editName" type="text"
                        class="w-full bg-white rounded-md border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                      <span v-else class="text-sm font-bold text-slate-700 truncate block">{{ req.name }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <template v-if="editingReqId === req.id">
                        <button @click="saveRequirementEdit(req)"
                          class="text-xs font-bold bg-[#164d23] text-white px-3 py-1.5 rounded-lg hover:bg-[#0d2b0f]">Save</button>
                        <button @click="editingReqId = null"
                          class="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-100">Cancel</button>
                      </template>
                      <template v-else>
                        <button @click="startEditRequirement(req)"
                          class="text-xs font-medium text-slate-400 hover:text-[#164d23] px-2 py-1.5 rounded hover:bg-slate-100">Edit</button>
                        <button @click="deleteRequirement(req)"
                          class="text-xs font-medium text-red-400 hover:text-red-600 px-2 py-1.5 rounded hover:bg-red-50">Delete</button>
                      </template>
                    </div>
                  </div>

                  <!-- Courses list -->
                  <div class="p-4">
                    <div v-if="!req.courses?.length" class="text-xs text-slate-400 italic pl-2 py-1">No courses in this requirement.</div>

                    <div class="space-y-1.5 mb-3">
                      <div v-for="cc in req.courses" :key="cc.id"
                        class="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 group">
                        <code class="text-xs font-mono text-slate-500 w-24 flex-shrink-0 truncate">{{ cc.course?.course_code || '—' }}</code>
                        <span class="flex-1 text-xs text-slate-700 truncate">{{ cc.course?.course_title }}</span>
                        <button @click="deleteCourseFromRequirement(req, cc)"
                          class="opacity-0 group-hover:opacity-100 transition w-5 h-5 rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          ×
                        </button>
                      </div>
                    </div>

                    <button @click="openAddCourseModal(req)"
                      class="text-xs font-bold text-[#164d23] hover:text-[#0d2b0f] flex items-center gap-1">
                      <span class="w-5 h-5 rounded-full bg-[#164d23] text-white text-sm font-bold flex items-center justify-center">+</span>
                      Add Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ④ STUDY PLAN -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="bg-[#0d2b0f] px-6 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black uppercase tracking-widest text-yellow-400">04</span>
                <span class="text-sm font-bold text-white uppercase tracking-wider">Program Study Plan</span>
              </div>
              <button @click="openAddStudyPlanModal"
                class="text-xs font-bold bg-yellow-400 text-[#0d2b0f] px-4 py-1.5 rounded-lg hover:bg-yellow-300 transition">
                + Add Course
              </button>
            </div>
            <div class="p-6">
              <div v-if="studyPlanGrouped.length === 0" class="text-center py-8 text-slate-400">
                <svg class="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-sm font-medium">No study plan entries yet</p>
                <p class="text-xs mt-1">Click "+ Add Course" to populate the study plan.</p>
              </div>

              <div v-else class="space-y-6">
                <div v-for="yearGroup in studyPlanGrouped" :key="yearGroup.year">
                  <h4 class="text-xs font-black uppercase tracking-widest text-[#164d23] mb-3 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-[#164d23] text-white text-xs flex items-center justify-center font-bold">{{ yearGroup.year }}</span>
                    Year {{ yearGroup.year }}
                  </h4>

                  <div v-for="semGroup in yearGroup.semesters" :key="semGroup.semester" class="mb-4">
                    <p class="text-xs font-semibold text-slate-500 mb-2 ml-1">
                      {{ semGroup.semester === 3 ? 'Summer' : `Semester ${semGroup.semester}` }}
                      <span class="text-slate-300 font-normal">({{ semGroup.entries.length }} course{{ semGroup.entries.length !== 1 ? 's' : '' }})</span>
                    </p>
                    <div class="rounded-xl overflow-hidden border border-slate-200">
                      <table class="w-full text-xs">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider w-28">Code</th>
                            <th class="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider">Title</th>
                            <th class="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider w-24">Type</th>
                            <th class="px-4 py-2.5 w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="entry in semGroup.entries" :key="entry.id" class="border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                            <td class="px-4 py-2.5 font-mono text-slate-600">{{ entry.course?.course_code || '—' }}</td>
                            <td class="px-4 py-2.5 text-slate-700">{{ entry.course?.course_title }}</td>
                            <td class="px-4 py-2.5 text-slate-400">{{ entry.type || '—' }}</td>
                            <td class="px-4 py-2.5 text-center">
                              <button @click="deleteStudyPlanEntry(entry)"
                                class="opacity-0 group-hover:opacity-100 transition w-5 h-5 rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold flex items-center justify-center mx-auto">×</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────
interface College { id: string; code: string; name: string }
interface Program { id: string; program_name: string; program_code: string | null; college_id: string }
interface Specialization { id: string; program_sp_name: string | null; program_id: string; program_sp_code: string }

interface CourseRef { id: string; course_code: string | null; course_title: string }

interface CurriculumCourse {
  id: string
  display_order: number | null
  course_id: string
  course: CourseRef
}

interface Requirement {
  id: string
  name: string
  description: string | null
  display_order: number | null
  courses: CurriculumCourse[]
  _editName?: string
  _editDescription?: string
}

interface StudyPlanEntry {
  id: string
  year_level: number
  semester: number
  display_order: number | null
  type: string | null
  course_id: string
  course: CourseRef
}

// ── State ──────────────────────────────────────────────────────────────
const colleges = ref<College[]>([])
const programs = ref<Program[]>([])
const specializations = ref<Specialization[]>([])

const selectedCollegeId = ref('')
const selectedProgramOrSpecId = ref('')   // can be program id OR specialization id

const curriculumId = ref<string | null>(null)
const isLoading = ref(false)

const detailsForm = ref({
  revision_year: null as number | null,
  revision_no: '',
  legal_basis: '',
  effectivity_term: '',
  description: '',
})
const detailsDirty = ref(false)
const isSavingDetails = ref(false)

const requirements = ref<Requirement[]>([])
const studyPlan = ref<StudyPlanEntry[]>([])

const editingReqId = ref<string | null>(null)

// Modals
const showAddCourseModal = ref(false)
const showAddRequirementModal = ref(false)
const showAddStudyPlanModal = ref(false)
const isSavingCourse = ref(false)
const isSavingReq = ref(false)
const isSavingStudyPlan = ref(false)

const addCourseTarget = ref<{ reqId: string; reqName: string } | null>(null)
const addCourseForm = ref({ course_code: '', course_title: '' })
const addReqForm = ref({ name: '', description: '' })
const addStudyPlanForm = ref({ course_code: '', course_title: '', year_level: 1, semester: 1, type: '' })

// Toast
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// ── Computed ───────────────────────────────────────────────────────────
const programOptions = computed(() => {
  const progs = programs.value.filter((p) => p.college_id === selectedCollegeId.value)

  // Build optgroups: one for programs, one for specializations
  const specOpts = specializations.value
    .filter((s) => progs.some((p) => p.id === s.program_id))
    .map((s) => {
      const prog = progs.find((p) => p.id === s.program_id)
      return { id: `spec:${s.id}`, name: `${prog?.program_code ?? ''} – ${s.program_sp_name ?? s.program_sp_code}` }
    })

  const progOpts = progs.map((p) => ({ id: `prog:${p.id}`, name: p.program_name }))

  return [
    ...(progOpts.length ? [{ label: 'Programs', options: progOpts }] : []),
    ...(specOpts.length ? [{ label: 'Specializations', options: specOpts }] : []),
  ]
})

const studyPlanGrouped = computed(() => {
  const map: Record<number, Record<number, StudyPlanEntry[]>> = {}
  for (const item of studyPlan.value) {
    if (!map[item.year_level]) map[item.year_level] = {}
    const yearSlot = map[item.year_level]!
    if (!yearSlot[item.semester]) yearSlot[item.semester] = []
    yearSlot[item.semester]!.push(item)
  }
  return Object.keys(map).map(Number).sort().map((year) => {
    const yearSlot = map[year]!
    return {
      year,
      semesters: Object.keys(yearSlot).map(Number).sort().map((sem) => ({
        semester: sem,
        entries: yearSlot[sem]!.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
      })),
    }
  })
})

// ── Fetch ──────────────────────────────────────────────────────────────
const fetchColleges = async () => {
  const { data } = await supabase.from('colleges').select('id, code, name').order('code')
  colleges.value = data || []
}

const fetchProgramsAndSpecs = async (collegeId: string) => {
  const { data: progs } = await supabase
    .from('programs')
    .select('id, program_name, program_code, college_id')
    .eq('college_id', collegeId)
    .order('program_name')
  programs.value = progs || []

  if (progs?.length) {
    const progIds = progs.map((p) => p.id)
    const { data: specs } = await supabase
      .from('program_specializations')
      .select('id, program_sp_name, program_sp_code, program_id')
      .in('program_id', progIds)
      .eq('is_active', true)
      .order('program_sp_name')
    specializations.value = specs || []
  } else {
    specializations.value = []
  }
}

const fetchCurriculum = async (programId: string | null, specId: string | null) => {
  isLoading.value = true
  curriculumId.value = null
  requirements.value = []
  studyPlan.value = []

  try {
    let query = supabase.from('curricula').select('*')

    if (specId) {
      query = query.eq('program_specialization_id', specId)
    } else if (programId) {
      query = query.eq('program_id', programId).is('program_specialization_id', null)
    } else return

    const { data: curr } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle()

    if (!curr) return

    curriculumId.value = curr.id
    detailsForm.value = {
      revision_year: curr.revision_year,
      revision_no: curr.revision_no || '',
      legal_basis: curr.legal_basis || '',
      effectivity_term: curr.effectivity_term || '',
      description: curr.description || '',
    }
    detailsDirty.value = false

    // Fetch requirements + courses
    const { data: reqs } = await supabase
      .from('curriculum_requirements')
      .select('id, name, description, display_order')
      .eq('curriculum_id', curr.id)
      .order('display_order')

    if (reqs) {
      const reqsWithCourses: Requirement[] = []
      for (const req of reqs) {
        const { data: ccRows } = await supabase
          .from('curriculum_courses')
          .select('id, display_order, course_id, courses(id, course_code, course_title)')
          .eq('requirement_id', req.id)
          .order('display_order')

        reqsWithCourses.push({
          ...req,
          courses: (ccRows || []).map((row: any) => ({
            id: row.id,
            display_order: row.display_order,
            course_id: row.course_id,
            course: row.courses,
          })),
        })
      }
      requirements.value = reqsWithCourses
    }

    // Fetch study plan
    const { data: planRows } = await supabase
      .from('program_study_plan')
      .select('id, year_level, semester, display_order, type, course_id, courses(id, course_code, course_title)')
      .eq('curriculum_id', curr.id)
      .order('year_level').order('semester').order('display_order')

    studyPlan.value = (planRows || []).map((row: any) => ({
      id: row.id,
      year_level: row.year_level,
      semester: row.semester,
      display_order: row.display_order,
      type: row.type,
      course_id: row.course_id,
      course: row.courses,
    }))
  } finally {
    isLoading.value = false
  }
}

// ── Handlers ───────────────────────────────────────────────────────────
const onCollegeChange = async () => {
  selectedProgramOrSpecId.value = ''
  curriculumId.value = null
  requirements.value = []
  studyPlan.value = []
  if (selectedCollegeId.value) await fetchProgramsAndSpecs(selectedCollegeId.value)
  else { programs.value = []; specializations.value = [] }
}

const onProgramChange = async () => {
  const val = selectedProgramOrSpecId.value
  if (!val) return

  if (val.startsWith('spec:')) {
    const specId = val.replace('spec:', '')
    const spec = specializations.value.find((s) => s.id === specId)
    await fetchCurriculum(spec?.program_id || null, specId)
  } else {
    const progId = val.replace('prog:', '')
    await fetchCurriculum(progId, null)
  }
}

// ── Details ────────────────────────────────────────────────────────────
const saveDetails = async () => {
  if (!curriculumId.value) return
  isSavingDetails.value = true
  try {
    const { error } = await supabase
      .from('curricula')
      .update({
        revision_year: detailsForm.value.revision_year,
        revision_no: detailsForm.value.revision_no || null,
        legal_basis: detailsForm.value.legal_basis || null,
        effectivity_term: detailsForm.value.effectivity_term || null,
        description: detailsForm.value.description || null,
      })
      .eq('id', curriculumId.value)
    if (error) throw error
    detailsDirty.value = false
    showToast('Details updated!', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to save details', 'error')
  } finally {
    isSavingDetails.value = false
  }
}

// ── Requirements ───────────────────────────────────────────────────────
const startEditRequirement = (req: Requirement) => {
  req._editName = req.name
  req._editDescription = req.description || ''
  editingReqId.value = req.id
}

const saveRequirementEdit = async (req: Requirement) => {
  try {
    const { error } = await supabase
      .from('curriculum_requirements')
      .update({ name: req._editName, description: req._editDescription || null })
      .eq('id', req.id)
    if (error) throw error
    req.name = req._editName!
    req.description = req._editDescription || null
    editingReqId.value = null
    showToast('Requirement updated!', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to update requirement', 'error')
  }
}

const deleteRequirement = async (req: Requirement) => {
  if (!confirm(`Delete requirement "${req.name}" and all its courses?`)) return
  try {
    const { error } = await supabase.from('curriculum_requirements').delete().eq('id', req.id)
    if (error) throw error
    requirements.value = requirements.value.filter((r) => r.id !== req.id)
    showToast('Requirement deleted.', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete requirement', 'error')
  }
}

const openAddRequirementModal = () => {
  addReqForm.value = { name: '', description: '' }
  showAddRequirementModal.value = true
}

const confirmAddRequirement = async () => {
  if (!curriculumId.value) return
  isSavingReq.value = true
  try {
    const { data, error } = await supabase
      .from('curriculum_requirements')
      .insert([{
        curriculum_id: curriculumId.value,
        name: addReqForm.value.name,
        description: addReqForm.value.description || null,
        display_order: requirements.value.length,
      }])
      .select().single()
    if (error) throw error
    requirements.value.push({ ...data, courses: [] })
    showAddRequirementModal.value = false
    showToast('Requirement added!', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to add requirement', 'error')
  } finally {
    isSavingReq.value = false
  }
}

// ── Courses in Requirements ─────────────────────────────────────────────
const openAddCourseModal = (req: Requirement) => {
  addCourseTarget.value = { reqId: req.id, reqName: req.name }
  addCourseForm.value = { course_code: '', course_title: '' }
  showAddCourseModal.value = true
}

const getOrCreateCourse = async (code: string, title: string): Promise<string> => {
  if (code.trim()) {
    const { data } = await supabase.from('courses').select('id').eq('course_code', code.trim()).maybeSingle()
    if (data) return data.id
  }
  const { data: created, error } = await supabase
    .from('courses')
    .insert([{ course_code: code.trim() || null, course_title: title.trim() }])
    .select().single()
  if (error) throw error
  return created.id
}

const confirmAddCourse = async () => {
  if (!addCourseTarget.value || !addCourseForm.value.course_title.trim()) return
  isSavingCourse.value = true
  try {
    const courseId = await getOrCreateCourse(addCourseForm.value.course_code, addCourseForm.value.course_title)

    const req = requirements.value.find((r) => r.id === addCourseTarget.value!.reqId)
    const { data: cc, error } = await supabase
      .from('curriculum_courses')
      .insert([{
        requirement_id: addCourseTarget.value.reqId,
        course_id: courseId,
        display_order: req?.courses.length ?? 0,
      }])
      .select('id, display_order, course_id, courses(id, course_code, course_title)')
      .single()
    if (error) throw error

    if (req) {
      req.courses.push({ id: cc.id, display_order: cc.display_order, course_id: cc.course_id, course: (cc as any).courses })
    }
    showAddCourseModal.value = false
    showToast('Course added!', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to add course', 'error')
  } finally {
    isSavingCourse.value = false
  }
}

const deleteCourseFromRequirement = async (req: Requirement, cc: CurriculumCourse) => {
  try {
    const { error } = await supabase.from('curriculum_courses').delete().eq('id', cc.id)
    if (error) throw error
    req.courses = req.courses.filter((c) => c.id !== cc.id)
    showToast('Course removed.', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to remove course', 'error')
  }
}

// ── Study Plan ─────────────────────────────────────────────────────────
const openAddStudyPlanModal = () => {
  addStudyPlanForm.value = { course_code: '', course_title: '', year_level: 1, semester: 1, type: '' }
  showAddStudyPlanModal.value = true
}

const confirmAddStudyPlan = async () => {
  if (!curriculumId.value || !addStudyPlanForm.value.course_title.trim()) return
  isSavingStudyPlan.value = true
  try {
    const courseId = await getOrCreateCourse(addStudyPlanForm.value.course_code, addStudyPlanForm.value.course_title)

    const { data: row, error } = await supabase
      .from('program_study_plan')
      .insert([{
        curriculum_id: curriculumId.value,
        course_id: courseId,
        year_level: addStudyPlanForm.value.year_level,
        semester: addStudyPlanForm.value.semester,
        type: addStudyPlanForm.value.type || null,
        display_order: studyPlan.value.length,
      }])
      .select('id, year_level, semester, display_order, type, course_id, courses(id, course_code, course_title)')
      .single()
    if (error) throw error

    studyPlan.value.push({
      id: row.id,
      year_level: row.year_level,
      semester: row.semester,
      display_order: row.display_order,
      type: row.type,
      course_id: row.course_id,
      course: (row as any).courses,
    })
    showAddStudyPlanModal.value = false
    showToast('Course added to study plan!', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to add study plan entry', 'error')
  } finally {
    isSavingStudyPlan.value = false
  }
}

const deleteStudyPlanEntry = async (entry: StudyPlanEntry) => {
  try {
    const { error } = await supabase.from('program_study_plan').delete().eq('id', entry.id)
    if (error) throw error
    studyPlan.value = studyPlan.value.filter((e) => e.id !== entry.id)
    showToast('Entry removed.', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete entry', 'error')
  }
}

// ── Toast ──────────────────────────────────────────────────────────────
const showToast = (msg: string, type: 'success' | 'error') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

onMounted(fetchColleges)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(1rem); }
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>