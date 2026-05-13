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
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-[#164d23]">New Curriculum</span>
        </div>
        <h1 class="text-3xl font-black tracking-tight text-[#0d2b0f]">
          Add Curriculum
          <span class="text-yellow-500">Record</span>
        </h1>
        <p class="text-sm text-slate-500 mt-1">Define a new curriculum for an academic program, including its requirements and study plan.</p>
      </header>

      <!-- Toast Notifications -->
      <transition name="toast">
        <div v-if="toastMessage" :class="['fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-xl text-sm font-semibold',
          toastType === 'error' ? 'bg-red-600 text-white' : 'bg-[#164d23] text-white']">
          <svg v-if="toastType === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ toastMessage }}
        </div>
      </transition>

      <!-- Add College Modal -->
      <transition name="modal">
        <div v-if="showAddCollegeModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 class="text-base font-black text-[#164d23] mb-4 uppercase tracking-wide">Add New College</h2>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Code</label>
                <input v-model="newCollege.code" type="text" placeholder="e.g., CCIS"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Name</label>
                <input v-model="newCollege.name" type="text" placeholder="e.g., College of Computing"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Level</label>
                <select v-model="newCollege.level"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                  <option value="">Select level...</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                </select>
              </div>
              <div class="flex gap-2 pt-1">
                <button @click="showAddCollegeModal = false"
                  class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button @click="saveNewCollege" :disabled="!newCollege.code || !newCollege.name"
                  class="flex-1 rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50">Add</button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Add Program Modal -->
      <transition name="modal">
        <div v-if="showAddProgramModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 class="text-base font-black text-[#164d23] mb-4 uppercase tracking-wide">Add New Program</h2>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Code</label>
                <input v-model="newProgram.program_code" type="text" placeholder="e.g., BSCS"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Name</label>
                <input v-model="newProgram.program_name" type="text" placeholder="e.g., BS Computer Science"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Level</label>
                <select v-model="newProgram.level"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                  <option value="">Select level...</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                </select>
              </div>
              <div class="flex gap-2 pt-1">
                <button @click="showAddProgramModal = false"
                  class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button @click="saveNewProgram" :disabled="!newProgram.program_code || !newProgram.program_name || !newProgram.level"
                  class="flex-1 rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50">Add</button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Add Study Plan Course Modal -->
      <transition name="modal">
        <div v-if="showAddStudyPlanModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 class="text-base font-black text-[#164d23] mb-1 uppercase tracking-wide">Add Course to Study Plan</h2>
            <p class="text-xs text-slate-400 mb-4">The course will be created or matched if code already exists.</p>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Year Level</label>
                  <select v-model.number="studyPlanEntry.year_level"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                    <option :value="1">Year 1</option>
                    <option :value="2">Year 2</option>
                    <option :value="3">Year 3</option>
                    <option :value="4">Year 4</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Semester</label>
                  <select v-model.number="studyPlanEntry.semester"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                    <option :value="1">Semester 1</option>
                    <option :value="2">Semester 2</option>
                    <option :value="3">Summer</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Course Code</label>
                <input v-model="studyPlanEntry.course_code" type="text" placeholder="e.g., CS101"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Course Title</label>
                <input v-model="studyPlanEntry.course_title" type="text" placeholder="e.g., Introduction to Computing"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Type <span class="text-slate-300">(optional)</span></label>
                <input v-model="studyPlanEntry.type" type="text" placeholder="e.g., Core, Elective"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div class="flex gap-2 pt-1">
                <button @click="showAddStudyPlanModal = false"
                  class="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button @click="confirmAddStudyPlanEntry" :disabled="!studyPlanEntry.course_title"
                  class="flex-1 rounded-lg bg-[#164d23] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d2b0f] disabled:opacity-50">Add Course</button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="max-w-5xl mx-auto space-y-5 pb-12">

        <!-- ① PROGRAM CONTEXT CARD -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="bg-[#0d2b0f] px-6 py-3.5 flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-widest text-yellow-400">01</span>
            <span class="text-sm font-bold text-white uppercase tracking-wider">Program Context</span>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">College</label>
                <div class="flex gap-2">
                  <select v-model="selectedCollegeId" @change="onCollegeChange"
                    class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                    <option value="">Select college...</option>
                    <option v-for="c in colleges" :key="c.id" :value="c.id">{{ c.code }} – {{ c.name }}</option>
                  </select>
                  <button @click="showAddCollegeModal = true" title="Add new college"
                    class="w-10 rounded-lg bg-[#0d2b0f] text-white text-lg font-bold hover:bg-[#164d23] flex items-center justify-center">+</button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Program</label>
                <div class="flex gap-2">
                  <select v-model="selectedProgramId" @change="onProgramChange" :disabled="!selectedCollegeId"
                    class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] disabled:opacity-50">
                    <option value="">Select program...</option>
                    <option v-for="p in filteredPrograms" :key="p.id" :value="p.id">{{ p.program_name }}</option>
                  </select>
                  <button @click="showAddProgramModal = true" :disabled="!selectedCollegeId" title="Add new program"
                    class="w-10 rounded-lg bg-[#0d2b0f] text-white text-lg font-bold hover:bg-[#164d23] flex items-center justify-center disabled:opacity-40">+</button>
                </div>
              </div>
            </div>

            <div v-if="specializations.length > 0">
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Specialization <span class="text-slate-300 normal-case font-normal">(leave blank for main program)</span>
              </label>
              <select v-model="selectedSpecializationId"
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]">
                <option value="">— Main Program (no specialization) —</option>
                <option v-for="s in specializations" :key="s.id" :value="s.id">{{ s.program_sp_name }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ② CURRICULUM DETAILS CARD -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="bg-[#164d23] px-6 py-3.5 flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-widest text-yellow-400">02</span>
            <span class="text-sm font-bold text-white uppercase tracking-wider">Curriculum Details</span>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Revision Year</label>
                <input v-model.number="form.revisionYear" type="number" placeholder="2024"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Revision No.</label>
                <input v-model="form.revisionNo" type="text" placeholder="e.g., 1.0"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Legal Basis</label>
                <input v-model="form.legalBasis" type="text" placeholder="CMO No. XX"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Effectivity</label>
                <input v-model="form.effectivityTerm" type="text" placeholder="A.Y. 2024-2025"
                  class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Brief description of this curriculum..."
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none"></textarea>
            </div>
          </div>
        </div>

        <!-- ③ REQUIREMENTS + COURSES CARD -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="bg-[#1b5e20] px-6 py-3.5 flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-widest text-yellow-400">03</span>
            <span class="text-sm font-bold text-white uppercase tracking-wider">Requirements &amp; Courses</span>
          </div>
          <div class="p-6">
            <div v-if="form.requirements.length === 0" class="text-center py-10 text-slate-400">
              <svg class="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p class="text-sm font-medium">No requirements yet</p>
              <p class="text-xs mt-1">Add requirements to define what courses are needed for this curriculum.</p>
            </div>

            <div class="space-y-4">
              <div v-for="(req, idx) in form.requirements" :key="idx"
                class="rounded-xl border border-slate-200 overflow-hidden">
                <!-- Requirement Header -->
                <div class="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-[#164d23] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {{ idx + 1 }}
                  </div>
                  <input v-model="req.name" type="text" placeholder="Requirement name (e.g., Core Courses)"
                    class="flex-1 bg-transparent text-sm font-bold text-slate-700 focus:outline-none placeholder:font-normal placeholder:text-slate-400" />
                  <button @click="removeRequirement(idx)"
                    class="text-xs text-red-400 hover:text-red-600 font-semibold px-2 py-1 rounded hover:bg-red-50 transition">
                    Remove
                  </button>
                </div>

                <div class="p-4 space-y-3">
                  <textarea v-model="req.description" rows="2" placeholder="Description of this requirement (optional)..."
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#164d23] resize-none bg-slate-50"></textarea>

                  <!-- Courses for this requirement -->
                  <div class="space-y-2">
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Courses</p>
                    <div v-if="req.courses.length === 0" class="text-xs text-slate-400 italic pl-2">
                      No courses added yet for this requirement.
                    </div>

                    <div v-for="(course, cIdx) in req.courses" :key="cIdx"
                      class="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <div class="w-5 h-5 rounded bg-[#164d23]/10 text-[#164d23] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {{ cIdx + 1 }}
                      </div>
                      <input v-model="course.course_code" type="text" placeholder="Code"
                        class="w-28 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                      <input v-model="course.course_title" type="text" placeholder="Course title"
                        class="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#164d23]" />
                      <button @click="removeCourse(idx, cIdx)"
                        class="w-6 h-6 rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition text-sm font-bold flex items-center justify-center flex-shrink-0">
                        ×
                      </button>
                    </div>
                  </div>

                  <button @click="addCourse(idx)"
                    class="text-xs font-bold text-[#164d23] hover:text-[#0d2b0f] flex items-center gap-1 pl-1">
                    <span class="w-5 h-5 rounded-full bg-[#164d23] text-white text-sm font-bold flex items-center justify-center">+</span>
                    Add Course to this Requirement
                  </button>
                </div>
              </div>
            </div>

            <button @click="addRequirement"
              class="mt-4 rounded-xl border-2 border-dashed border-[#164d23]/30 text-[#164d23] px-6 py-3 text-sm font-bold w-full hover:border-[#164d23] hover:bg-[#164d23]/5 transition flex items-center justify-center gap-2">
              <span class="text-lg">+</span> Add Requirement
            </button>
          </div>
        </div>

        <!-- ④ PROGRAM STUDY PLAN CARD -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="bg-[#0d2b0f] px-6 py-3.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-widest text-yellow-400">04</span>
              <span class="text-sm font-bold text-white uppercase tracking-wider">Program Study Plan</span>
            </div>
            <span class="text-xs text-slate-400 font-medium">{{ form.studyPlan.length }} course{{ form.studyPlan.length !== 1 ? 's' : '' }} added</span>
          </div>
          <div class="p-6">
            <p class="text-xs text-slate-400 mb-4">
              The study plan maps each course to a specific year and semester. Courses added here are referenced from the <code class="bg-slate-100 px-1 rounded">program_study_plan</code> table.
              If a course code already exists in <code class="bg-slate-100 px-1 rounded">courses</code>, it will be reused automatically.
            </p>

            <!-- Grouped display -->
            <div v-if="form.studyPlan.length > 0" class="space-y-5 mb-5">
              <div v-for="yearGroup in studyPlanGrouped" :key="yearGroup.year">
                <h4 class="text-xs font-black uppercase tracking-widest text-[#164d23] mb-3 flex items-center gap-2">
                  <span class="w-6 h-6 rounded bg-[#164d23] text-white text-xs flex items-center justify-center font-bold">{{ yearGroup.year }}</span>
                  Year {{ yearGroup.year }}
                </h4>
                <div v-for="semGroup in yearGroup.semesters" :key="semGroup.semester" class="mb-3">
                  <p class="text-xs font-semibold text-slate-500 mb-2 ml-1">
                    {{ semGroup.semester === 3 ? 'Summer' : `Semester ${semGroup.semester}` }}
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
                        <tr v-for="(entry, i) in semGroup.entries" :key="i" class="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td class="px-4 py-2.5 font-mono text-slate-700">{{ entry.course_code || '—' }}</td>
                          <td class="px-4 py-2.5 text-slate-700">{{ entry.course_title }}</td>
                          <td class="px-4 py-2.5 text-slate-400">{{ entry.type || '—' }}</td>
                          <td class="px-4 py-2.5 text-center">
                            <button @click="removeStudyPlanEntry(entry._localIdx)"
                              class="w-5 h-5 rounded bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition text-sm font-bold flex items-center justify-center mx-auto">×</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="form.studyPlan.length === 0" class="text-center py-8 text-slate-400 mb-4">
              <svg class="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-sm font-medium">No study plan entries yet</p>
            </div>

            <button @click="openAddStudyPlanModal"
              class="rounded-xl border-2 border-dashed border-[#0d2b0f]/30 text-[#0d2b0f] px-6 py-3 text-sm font-bold w-full hover:border-[#0d2b0f] hover:bg-[#0d2b0f]/5 transition flex items-center justify-center gap-2">
              <span class="text-lg">+</span> Add Course to Study Plan
            </button>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="flex items-center justify-between pt-2">
          <button @click="$router.push('/admin/services/curriculum')"
            class="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
            ← Cancel
          </button>
          <button @click="saveCurriculum" :disabled="isSaving || !selectedProgramId"
            class="rounded-xl bg-[#164d23] px-10 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-[#0d2b0f] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#164d23]/20 flex items-center gap-2">
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isSaving ? 'Saving...' : 'Save Curriculum' }}
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

const router = useRouter()

// ── Types ──────────────────────────────────────────────────────────────
interface College { id: string; code: string; name: string }
interface Program { id: string; program_name: string; college_id: string }
interface Specialization { id: string; program_sp_name: string | null; program_id: string }

interface CourseEntry {
  course_code: string
  course_title: string
}

interface RequirementEntry {
  name: string
  description: string
  courses: CourseEntry[]
}

interface StudyPlanEntry {
  course_code: string
  course_title: string
  year_level: number
  semester: number
  type: string
  _localIdx: number          // for removal by index
}

// ── State ──────────────────────────────────────────────────────────────
const colleges = ref<College[]>([])
const programs = ref<Program[]>([])
const specializations = ref<Specialization[]>([])

const selectedCollegeId = ref('')
const selectedProgramId = ref('')
const selectedSpecializationId = ref('')

const isSaving = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Modals
const showAddCollegeModal = ref(false)
const showAddProgramModal = ref(false)
const showAddStudyPlanModal = ref(false)

const newCollege = ref({ code: '', name: '', level: '' })
const newProgram = ref({ program_code: '', program_name: '', level: '' })
const studyPlanEntry = ref({ course_code: '', course_title: '', year_level: 1, semester: 1, type: '' })

const form = ref({
  revisionYear: null as number | null,
  revisionNo: '',
  legalBasis: '',
  effectivityTerm: '',
  description: '',
  requirements: [] as RequirementEntry[],
  studyPlan: [] as StudyPlanEntry[],
})

// ── Computed ───────────────────────────────────────────────────────────
const filteredPrograms = computed(() =>
  programs.value.filter((p) => p.college_id === selectedCollegeId.value),
)

const studyPlanGrouped = computed(() => {
  const map: Record<number, Record<number, (StudyPlanEntry & { _localIdx: number })[]>> = {}

  form.value.studyPlan.forEach((entry, idx) => {
    if (!map[entry.year_level]) map[entry.year_level] = {}
    const yearSlot = map[entry.year_level]!
    if (!yearSlot[entry.semester]) yearSlot[entry.semester] = []
    yearSlot[entry.semester]!.push({ ...entry, _localIdx: idx })
  })

  return Object.keys(map)
    .map(Number)
    .sort()
    .map((year) => {
      const yearSlot = map[year]!
      return {
        year,
        semesters: Object.keys(yearSlot)
          .map(Number)
          .sort()
          .map((sem) => ({ semester: sem, entries: yearSlot[sem]! })),
      }
    })
})

// ── Fetch ──────────────────────────────────────────────────────────────
const fetchColleges = async () => {
  const { data } = await supabase.from('colleges').select('id, code, name').order('code')
  colleges.value = data || []
}

const fetchPrograms = async () => {
  const { data } = await supabase.from('programs').select('id, program_name, college_id').order('program_name')
  programs.value = data || []
}

const fetchSpecializations = async (programId: string) => {
  const { data } = await supabase
    .from('program_specializations')
    .select('id, program_sp_name, program_id')
    .eq('program_id', programId)
    .eq('is_active', true)
    .order('program_sp_name')
  specializations.value = data || []
}

// ── Handlers ───────────────────────────────────────────────────────────
const onCollegeChange = () => {
  selectedProgramId.value = ''
  selectedSpecializationId.value = ''
  specializations.value = []
}

const onProgramChange = () => {
  selectedSpecializationId.value = ''
  if (selectedProgramId.value) fetchSpecializations(selectedProgramId.value)
  else specializations.value = []
}

// ── College / Program Modals ───────────────────────────────────────────
const saveNewCollege = async () => {
  try {
    const { data, error } = await supabase
      .from('colleges')
      .insert([{ code: newCollege.value.code, name: newCollege.value.name, level: newCollege.value.level || null }])
      .select().single()
    if (error) throw error
    colleges.value.push(data)
    selectedCollegeId.value = data.id
    newCollege.value = { code: '', name: '', level: '' }
    showAddCollegeModal.value = false
    showToast('College added!', 'success')
  } catch (e: any) {
    showToast(e?.message || 'Failed to add college', 'error')
  }
}

const saveNewProgram = async () => {
  try {
    const { data, error } = await supabase
      .from('programs')
      .insert([{
        college_id: selectedCollegeId.value,
        program_code: newProgram.value.program_code,
        program_name: newProgram.value.program_name,
        level: newProgram.value.level,
      }])
      .select().single()
    if (error) throw error
    programs.value.push(data)
    selectedProgramId.value = data.id
    newProgram.value = { program_code: '', program_name: '', level: '' }
    showAddProgramModal.value = false
    showToast('Program added!', 'success')
    await fetchSpecializations(data.id)
  } catch (e: any) {
    showToast(e?.message || 'Failed to add program', 'error')
  }
}

// ── Requirements ───────────────────────────────────────────────────────
const addRequirement = () => {
  form.value.requirements.push({ name: '', description: '', courses: [] })
}

const removeRequirement = (idx: number) => {
  form.value.requirements.splice(idx, 1)
}

const addCourse = (reqIdx: number) => {
  form.value.requirements[reqIdx]?.courses.push({ course_code: '', course_title: '' })
}

const removeCourse = (reqIdx: number, cIdx: number) => {
  form.value.requirements[reqIdx]?.courses.splice(cIdx, 1)
}

// ── Study Plan ─────────────────────────────────────────────────────────
const openAddStudyPlanModal = () => {
  studyPlanEntry.value = { course_code: '', course_title: '', year_level: 1, semester: 1, type: '' }
  showAddStudyPlanModal.value = true
}

const confirmAddStudyPlanEntry = () => {
  if (!studyPlanEntry.value.course_title.trim()) return
  form.value.studyPlan.push({
    ...studyPlanEntry.value,
    _localIdx: form.value.studyPlan.length,
  })
  // Re-assign _localIdx for all entries
  form.value.studyPlan = form.value.studyPlan.map((e, i) => ({ ...e, _localIdx: i }))
  showAddStudyPlanModal.value = false
}

const removeStudyPlanEntry = (localIdx: number) => {
  form.value.studyPlan.splice(localIdx, 1)
  form.value.studyPlan = form.value.studyPlan.map((e, i) => ({ ...e, _localIdx: i }))
}

// ── Toast ──────────────────────────────────────────────────────────────
const showToast = (msg: string, type: 'success' | 'error') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

// ── Save ───────────────────────────────────────────────────────────────
const getOrCreateCourse = async (code: string | null, title: string): Promise<string> => {
  if (code && code.trim()) {
    const { data: existing } = await supabase
      .from('courses').select('id').eq('course_code', code.trim()).maybeSingle()
    if (existing) return existing.id
  }

  const { data: created, error } = await supabase
    .from('courses')
    .insert([{ course_code: code?.trim() || null, course_title: title.trim() }])
    .select().single()
  if (error) throw error
  return created.id
}

const saveCurriculum = async () => {
  if (!selectedProgramId.value) {
    showToast('Please select a program first.', 'error')
    return
  }

  isSaving.value = true
  try {
    // 1. Insert curricula row
    // Always set program_id; set program_specialization_id if a specialization is chosen
    const { data: curriculum, error: currError } = await supabase
      .from('curricula')
      .insert([{
        program_id: selectedProgramId.value,
        program_specialization_id: selectedSpecializationId.value || null,
        revision_year: form.value.revisionYear,
        revision_no: form.value.revisionNo || null,
        legal_basis: form.value.legalBasis || null,
        effectivity_term: form.value.effectivityTerm || null,
        description: form.value.description || null,
      }])
      .select().single()
    if (currError) throw currError
    const curriculumId = curriculum.id

    // 2. Insert requirements + their courses
    for (let rIdx = 0; rIdx < form.value.requirements.length; rIdx++) {
      const req = form.value.requirements[rIdx]
      if (!req) continue

      const { data: reqRow, error: reqErr } = await supabase
        .from('curriculum_requirements')
        .insert([{
          curriculum_id: curriculumId,
          name: req.name || `Requirement ${rIdx + 1}`,
          description: req.description || null,
          display_order: rIdx,
        }])
        .select().single()
      if (reqErr) throw reqErr

      for (let cIdx = 0; cIdx < req.courses.length; cIdx++) {
        const c = req.courses[cIdx]
        if (!c || !c.course_title.trim()) continue

        const courseId = await getOrCreateCourse(c.course_code, c.course_title)

        const { error: linkErr } = await supabase
          .from('curriculum_courses')
          .insert([{ requirement_id: reqRow.id, course_id: courseId, display_order: cIdx }])
        if (linkErr) throw linkErr
      }
    }

    // 3. Insert study plan entries
    for (let pIdx = 0; pIdx < form.value.studyPlan.length; pIdx++) {
      const entry = form.value.studyPlan[pIdx]
      if (!entry || !entry.course_title.trim()) continue

      const courseId = await getOrCreateCourse(entry.course_code, entry.course_title)

      const { error: planErr } = await supabase
        .from('program_study_plan')
        .insert([{
          curriculum_id: curriculumId,
          course_id: courseId,
          year_level: entry.year_level,
          semester: entry.semester,
          type: entry.type || null,
          display_order: pIdx,
        }])
      if (planErr) throw planErr
    }

    showToast('Curriculum saved successfully!', 'success')
    setTimeout(() => router.push('/admin/services/curriculum'), 1500)
  } catch (e: any) {
    console.error(e)
    showToast(e?.message || 'Failed to save curriculum.', 'error')
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
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(1rem); }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>