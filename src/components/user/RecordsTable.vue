<template>
  <div class="mt-8">
    <div class="border border-gray-300 rounded-lg overflow-x-auto">
      <div class="max-h-96 overflow-y-auto">
        <table class="min-w-full text-sm border-collapse">
          <thead class="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th class="border px-4 py-2">ID</th>
              <th class="border px-4 py-2">Name</th>
              <th class="border px-4 py-2">Principal</th>
              <th class="border px-4 py-2">Certification</th>
              <th class="border px-4 py-2 min-w-[130px]">Exam Registration Date</th>
              <th class="border px-4 py-2 min-w-[130px]">Exam Date</th>
              <th class="border px-4 py-2">Cost (USD)</th>
              <th class="border px-4 py-2">Payment Method/Discount</th>
              <th class="border px-4 py-2">Paid By</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading Spinner -->
            <tr v-if="loading">
              <td colspan="9" class="text-center py-6">
                <div class="flex justify-center items-center space-x-2 text-blue-600">
                  <svg
                    class="animate-spin h-6 w-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Loading records...</span>
                </div>
              </td>
            </tr>

            <!-- No data -->
            <tr v-else-if="filteredRecords.length === 0">
              <td colspan="9" class="text-center py-4">No data available</td>
            </tr>

            <!-- Data rows -->
            <tr v-else v-for="(record, index) in filteredRecords" :key="index">
              <td class="border px-4 py-2">{{ record.tracking_id }}</td>
              <td class="border px-4 py-2">{{ record.name }}</td>
              <td class="border px-4 py-2">{{ record.principal_name }}</td>
              <td class="border px-4 py-2">{{ record.certification_name }}</td>
              <td class="border px-4 py-2 min-w-[130px]">{{ formatDate(record.exam_regist_date) }}</td>
              <td class="border px-4 py-2 min-w-[130px]">{{ formatDate(record.exam_date) }}</td>
              <td class="border px-4 py-2">{{ formatUSD(record.cost_amount_usd) }}</td>
              <td class="border px-4 py-2">{{ record.payment_method }}</td>
              <td class="border px-4 py-2">{{ record.paid_by }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecordsTable",
  props: {
    records: { type: Array, required: true },
    loading: { type: Boolean, default: false },
    currentUserName: { type: String, required: true }
  },
  computed: {
    filteredRecords() {
      return this.records.filter(r => r.name === this.currentUserName);
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "-";

      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];

      const year = date.getFullYear();

      return `${day}-${month}-${year}`;   
    },
    formatUSD(value) {
      if (value == null) return "-";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value);
    }
  }
};
</script>
