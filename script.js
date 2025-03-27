// DOM Elements
const studentPhotoInput = document.getElementById('studentPhoto');
const photoPreview = document.getElementById('photoPreview');
const subjectsBody = document.getElementById('subjectsBody');
const reportPreview = document.getElementById('reportPreview');

// Sample subjects (can be expanded)
const sampleSubjects = [
    "Mathematics", "English Language", "Physics", 
    "Chemistry", "Biology", "Geography",
    "Economics", "Commerce", "Government",
    "Literature in English", "History", "CRK/IRK"
];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Add first subject row by default
    addSubject();
    
    // Handle photo upload preview
    studentPhotoInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                photoPreview.classList.add('fade-in');
                setTimeout(() => photoPreview.classList.remove('fade-in'), 300);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
});

// Add a new subject row
function addSubject() {
    const row = document.createElement('tr');
    row.className = 'subject-row';
    row.innerHTML = `
        <td class="border px-4 py-2">
            <select class="subject-select w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500">
                <option value="">Select Subject</option>
                ${sampleSubjects.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
                <option value="other">Other...</option>
            </select>
            <input type="text" class="custom-subject hidden w-full px-2 py-1 border rounded mt-1" placeholder="Enter subject name">
        </td>
        <td class="border px-4 py-2">
            <input type="number" min="0" max="40" class="ca-score w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500">
        </td>
        <td class="border px-4 py-2">
            <input type="number" min="0" max="60" class="exam-score w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500">
        </td>
        <td class="border px-4 py-2 total-score text-center">-</td>
        <td class="border px-4 py-2 grade text-center">-</td>
        <td class="border px-4 py-2 remark text-center">-</td>
        <td class="border px-4 py-2 text-center">
            <button onclick="removeSubject(this)" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;
    
    subjectsBody.appendChild(row);
    
    // Handle subject select change
    const subjectSelect = row.querySelector('.subject-select');
    subjectSelect.addEventListener('change', function() {
        const customInput = this.closest('td').querySelector('.custom-subject');
        if (this.value === 'other') {
            customInput.classList.remove('hidden');
        } else {
            customInput.classList.add('hidden');
        }
    });
    
    // Add event listeners for score calculation
    const caInput = row.querySelector('.ca-score');
    const examInput = row.querySelector('.exam-score');
    
    const calculateScores = () => {
        const ca = parseFloat(caInput.value) || 0;
        const exam = parseFloat(examInput.value) || 0;
        const total = ca + exam;
        
        const totalCell = row.querySelector('.total-score');
        const gradeCell = row.querySelector('.grade');
        const remarkCell = row.querySelector('.remark');
        
        totalCell.textContent = total;
        
        if (total >= 70) {
            gradeCell.textContent = 'A';
            remarkCell.textContent = 'Excellent';
            remarkCell.className = 'border px-4 py-2 remark text-center text-green-600';
        } else if (total >= 60) {
            gradeCell.textContent = 'B';
            remarkCell.textContent = 'Very Good';
            remarkCell.className = 'border px-4 py-2 remark text-center text-green-500';
        } else if (total >= 50) {
            gradeCell.textContent = 'C';
            remarkCell.textContent = 'Good';
            remarkCell.className = 'border px-4 py-2 remark text-center text-blue-500';
        } else if (total >= 40) {
            gradeCell.textContent = 'D';
            remarkCell.textContent = 'Pass';
            remarkCell.className = 'border px-4 py-2 remark text-center text-yellow-500';
        } else if (total >= 30) {
            gradeCell.textContent = 'E';
            remarkCell.textContent = 'Below Average';
            remarkCell.className = 'border px-4 py-2 remark text-center text-orange-500';
        } else if (total > 0) {
            gradeCell.textContent = 'F';
            remarkCell.textContent = 'Fail';
            remarkCell.className = 'border px-4 py-2 remark text-center text-red-500';
        } else {
            gradeCell.textContent = '-';
            remarkCell.textContent = '-';
            remarkCell.className = 'border px-4 py-2 remark text-center';
        }
    };
    
    caInput.addEventListener('input', calculateScores);
    examInput.addEventListener('input', calculateScores);
}

// Remove a subject row
function removeSubject(button) {
    const row = button.closest('tr');
    if (subjectsBody.querySelectorAll('tr').length > 1) {
        row.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => row.remove(), 300);
    } else {
        alert('You must have at least one subject!');
    }
}

// Generate the report
function generateReport() {
    // Validate form
    if (!validateForm()) return;
    
    // Show loading state
    const generateBtn = document.querySelector('button[onclick="generateReport()"]');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
    generateBtn.disabled = true;
    
    setTimeout(() => {
        // Get student info
        const studentName = document.getElementById('studentName').value;
        const studentClass = document.getElementById('studentClass').value;
        const studentGender = document.getElementById('studentGender').value;
        const regNumber = document.getElementById('regNumber').value;
        
        // Get subjects data
        const subjects = [];
        let totalPassed = 0;
        let totalFailed = 0;
        let totalScore = 0;
        
        document.querySelectorAll('.subject-row').forEach(row => {
            const subjectSelect = row.querySelector('.subject-select');
            const customSubject = row.querySelector('.custom-subject');
            const subjectName = subjectSelect.value === 'other' 
                ? customSubject.value 
                : subjectSelect.value;
            
            const caScore = parseFloat(row.querySelector('.ca-score').value) || 0;
            const examScore = parseFloat(row.querySelector('.exam-score').value) || 0;
            const total = caScore + examScore;
            const grade = row.querySelector('.grade').textContent;
            const remark = row.querySelector('.remark').textContent;
            
            subjects.push({ subjectName, caScore, examScore, total, grade, remark });
            
            totalScore += total;
            if (grade === 'A' || grade === 'B' || grade === 'C' || grade === 'D') {
                totalPassed++;
            } else if (grade === 'E' || grade === 'F') {
                totalFailed++;
            }
        });
        
        const averageScore = totalScore / subjects.length;
        const percentagePassed = (totalPassed / subjects.length) * 100;
        
        // Generate report HTML
        const reportHTML = `
            <div class="report-container p-6 print:p-0">
                <div class="report-header">
                    <img src="https://via.placeholder.com/150x80?text=School+Logo" alt="School Logo" class="report-logo mx-auto">
                    <h1 class="text-2xl font-bold">LATTER GLORY ACADEMY</h1>
                    <p class="text-sm">123 Education Road, Knowledge City</p>
                    <p class="text-sm">Phone: (123) 456-7890 | Email: info@latterglory.edu</p>
                </div>
                
                <div class="text-center mb-6">
                    <h2 class="text-xl font-bold uppercase">Student Result Report</h2>
                    <p class="text-sm">Term: First Term 2023/2024 Academic Session</p>
                </div>
                
                <div class="flex flex-col md:flex-row gap-6 mb-8">
                    <div class="flex-1">
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="font-semibold">Name:</p>
                                <p>${studentName}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Class:</p>
                                <p>${studentClass}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Gender:</p>
                                <p>${studentGender}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Reg. Number:</p>
                                <p>${regNumber}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center md:justify-end">
                        <img src="${photoPreview.src}" alt="Student Photo" class="student-photo">
                    </div>
                </div>
                
                <div class="mb-8">
                    <h3 class="text-lg font-semibold mb-2">Academic Performance</h3>
                    <table class="score-table w-full mb-4">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>C.A (40)</th>
                                <th>Exam (60)</th>
                                <th>Total (100)</th>
                                <th>Grade</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjects.map(subject => `
                                <tr>
                                    <td>${subject.subjectName}</td>
                                    <td>${subject.caScore}</td>
                                    <td>${subject.examScore}</td>
                                    <td>${subject.total}</td>
                                    <td class="${getGradeColorClass(subject.grade)}">${subject.grade}</td>
                                    <td class="${getRemarkColorClass(subject.remark)}">${subject.remark}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="performance-card">
                        <h4 class="font-semibold mb-2">Performance Summary</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p>Total Subjects:</p>
                                <p class="font-semibold">${subjects.length}</p>
                            </div>
                            <div>
                                <p>Subjects Passed:</p>
                                <p class="font-semibold text-green-600">${totalPassed}</p>
                            </div>
                            <div>
                                <p>Subjects Failed:</p>
                                <p class="font-semibold text-red-600">${totalFailed}</p>
                            </div>
                            <div>
                                <p>Average Score:</p>
                                <p class="font-semibold">${averageScore.toFixed(2)}</p>
                            </div>
                            <div>
                                <p>Percentage Passed:</p>
                                <p class="font-semibold">${percentagePassed.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="performance-card">
                        <h4 class="font-semibold mb-2">Comments</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block mb-1">Class Teacher's Comment:</label>
                                <textarea id="teacherComment" class="w-full border rounded p-2" rows="2"></textarea>
                            </div>
                            <div>
                                <label class="block mb-1">Principal's Comment:</label>
                                <textarea id="principalComment" class="w-full border rounded p-2" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-between items-center mt-8">
                    <div class="text-center">
                        <p class="signature-line"></p>
                        <p>Class Teacher's Signature</p>
                    </div>
                    <div class="text-center">
                        <p class="signature-line"></p>
                        <p>Principal's Signature</p>
                    </div>
                </div>
                
                <div class="text-center mt-8 text-sm">
                    <p>Date Generated: ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    <p class="text-gray-600 italic">This is a computer generated report. No signature is required.</p>
                </div>
                
                <div class="mt-8 text-center no-print">
                    <button onclick="window.print()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-4">
                        <i class="fas fa-print mr-2"></i>Print Report
                    </button>
                    <button onclick="saveAsPDF()" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        <i class="fas fa-file-pdf mr-2"></i>Save as PDF
                    </button>
                </div>
            </div>
        `;
        
        // Display report
        reportPreview.innerHTML = reportHTML;
        reportPreview.classList.remove('hidden');
        reportPreview.scrollIntoView({ behavior: 'smooth' });
        
        // Restore button state
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }, 800); // Simulate processing delay
}

// Helper function to get grade color class
function getGradeColorClass(grade) {
    switch(grade) {
        case 'A': return 'text-green-600';
        case 'B': return 'text-green-500';
        case 'C': return 'text-blue-500';
        case 'D': return 'text-yellow-500';
        case 'E': return 'text-orange-500';
        case 'F': return 'text-red-500';
        default: return '';
    }
}

// Helper function to get remark color class
function getRemarkColorClass(remark) {
    switch(remark) {
        case 'Excellent': return 'text-green-600';
        case 'Very Good': return 'text-green-500';
        case 'Good': return 'text-blue-500';
        case 'Pass': return 'text-yellow-500';
        case 'Below Average': return 'text-orange-500';
        case 'Fail': return 'text-red-500';
        default: return '';
    }
}

// Validate form before generating report
function validateForm() {
    const studentName = document.getElementById('studentName').value;
    const studentClass = document.getElementById('studentClass').value;
    const studentGender = document.getElementById('studentGender').value;
    const regNumber = document.getElementById('regNumber').value;
    
    if (!studentName || !studentClass || !studentGender || !regNumber) {
        showAlert('Please fill in all student information fields!', 'error');
        return false;
    }
    
    if (photoPreview.src.includes('placeholder.com')) {
        showAlert('Please upload a student passport photograph!', 'error');
        return false;
    }
    
    let valid = true;
    document.querySelectorAll('.subject-row').forEach(row => {
        const subjectSelect = row.querySelector('.subject-select');
        const customSubject = row.querySelector('.custom-subject');
        const subjectName = subjectSelect.value === 'other' 
            ? customSubject.value 
            : subjectSelect.value;
        
        const caScore = row.querySelector('.ca-score').value;
        const examScore = row.querySelector('.exam-score').value;
        
        if (!subjectName) {
            showAlert('Please select or enter a subject name for all subjects!', 'error');
            valid = false;
            return;
        }
        
        if (!caScore || !examScore) {
            showAlert('Please enter both C.A and Exam scores for all subjects!', 'error');
            valid = false;
            return;
        }
        
        if (parseFloat(caScore) > 40 || parseFloat(examScore) > 60) {
            showAlert('Scores exceed maximum allowed values (C.A: 40, Exam: 60)!', 'error');
            valid = false;
            return;
        }
    });
    
    return valid;
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    alertDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'error' ? 'fa-exclamation-circle' : 
                type === 'success' ? 'fa-check-circle' : 'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
}

// Save report as PDF (using jsPDF)
function saveAsPDF() {
    // Show loading state
    const pdfBtn = document.querySelector('button[onclick="saveAsPDF()"]');
    const originalText = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating PDF...';
    pdfBtn.disabled = true;
    
    // Simulate PDF generation (actual implementation would use jsPDF)
    setTimeout(() => {
        showAlert('For actual implementation, include jsPDF library from CDN and implement PDF generation', 'info');
        pdfBtn.innerHTML = originalText;
        pdfBtn.disabled = false;
    }, 1500);
}

// To implement actual PDF generation:
// 1. Add this to your HTML head: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// 2. Replace the saveAsPDF function with actual jsPDF code