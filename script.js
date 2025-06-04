    // Wizard Navigation
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    function showStep(index) {
      steps.forEach((step, i) => {
        step.style.display = (i === index) ? 'block' : 'none';
      });
    }
    function nextStep() {
      if (validateCurrentStep()) {
        currentStep++;
        if (currentStep >= steps.length) currentStep = steps.length - 1;
        showStep(currentStep);
      } else {
        alert('Please fill in all required fields in this step.');
      }
    }
    function prevStep() {
      currentStep--;
      if (currentStep < 0) currentStep = 0;
      showStep(currentStep);
    }
    function validateCurrentStep() {
      let valid = true;
      const currentFields = steps[currentStep].querySelectorAll('[required]');
      currentFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });
      return valid;
    }
    showStep(currentStep);

    // Top Navigation Links: Set wizard step based on anchor click
    document.querySelectorAll('.nav-menu a').forEach(link => {
      // Only handle links that point to steps (e.g., #step1, #step2, etc.)
      if(link.getAttribute('href').startsWith("#step")){
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const stepId = this.getAttribute('href').substring(1);
          const targetStepIndex = Array.from(steps).findIndex(step => step.id === stepId);
          if (targetStepIndex !== -1) {
            currentStep = targetStepIndex;
            showStep(currentStep);
          }
        });
      }
    });

    // Real-Time Preview Update (Debounced)
    const updatePreviewDebounced = debounce(updatePreview, 300);
    document.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', updatePreviewDebounced);
    });
    function updatePreview() {
      const previewContainer = document.querySelector('.preview-container');
      previewContainer.innerHTML = generatePreviewHTML();
    }
    function generatePreviewHTML() {
      const campaignName = document.getElementById('campaign-name').value;
      const objective = document.getElementById('campaign-objective').value;
      const budget = document.getElementById('budget-amount').value;
      const imageUrl = document.getElementById('image-url').value;
      const primaryText = document.getElementById('primary-text').value;
      const headline = document.getElementById('headline').value;
      const description = document.getElementById('description').value;
      const callToAction = document.getElementById('call-to-action').value;
      const studentName = document.getElementById('student-name').value;
      const strategy = document.getElementById('strategy-description').value;
      return `
        <h3>Campaign Details</h3>
        <div class="preview-text"><strong>Campaign Name:</strong> ${campaignName}</div>
        <div class="preview-text"><strong>Objective:</strong> ${objective}</div>
        <div class="preview-text"><strong>Budget:</strong> $${budget}</div>
        <h3>Ad Creative</h3>
        ${imageUrl ? `<img src="${imageUrl}" alt="Ad Preview" class="preview-image">` : '<div class="preview-text">[No image provided]</div>'}
        <div class="preview-text"><strong>Primary Text:</strong> ${primaryText}</div>
        <div class="preview-text"><strong>Headline:</strong> ${headline}</div>
        <div class="preview-text"><strong>Description:</strong> ${description}</div>
        <div class="preview-text"><strong>Call to Action:</strong> ${callToAction}</div>
        <h3>Strategy Summary</h3>
        <div class="preview-text"><strong>Student Name:</strong> ${studentName}</div>
        <div class="preview-text"><strong>Strategy:</strong> ${strategy}</div>
      `;
    }
    function reviewAd() {
      if (!validateAllSteps()) {
        alert('Please fill in all required fields.');
        return;
      }
      updatePerformanceMetrics();
      document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });
    }
    function validateAllSteps() {
      let valid = true;
      document.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });
      return valid;
    }
    // Debounce utility
    function debounce(func, delay) {
      let inDebounce;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
      }
    }

    // Save and Load Draft Functionality on All Steps
    function saveDraft() {
      const formData = {
        campaignName: document.getElementById('campaign-name').value,
        buyingType: document.getElementById('buying-type').value,
        spendingLimit: document.getElementById('spending-limit').value,
        campaignObjective: document.getElementById('campaign-objective').value,
        specialCategory: document.getElementById('special-category').value,
        budgetType: document.getElementById('budget-type').value,
        budgetAmount: document.getElementById('budget-amount').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        locations: document.getElementById('locations').value,
        ageRange: document.getElementById('age-range').value,
        gender: document.getElementById('gender').value,
        detailedTargeting: document.getElementById('detailed-targeting').value,
        facebookPage: document.getElementById('facebook-page').value,
        instagramAccount: document.getElementById('instagram-account').value,
        adFormat: document.getElementById('ad-format').value,
        imageUrl: document.getElementById('image-url').value,
        primaryText: document.getElementById('primary-text').value,
        headline: document.getElementById('headline').value,
        description: document.getElementById('description').value,
        websiteUrl: document.getElementById('website-url').value,
        callToAction: document.getElementById('call-to-action').value,
        studentName: document.getElementById('student-name').value,
        strategy: document.getElementById('strategy-description').value,
        currentStep: currentStep
      };
      localStorage.setItem('fbAdDraft', JSON.stringify(formData));
      alert('Draft saved successfully!');
    }
    function loadDraft() {
      const draft = localStorage.getItem('fbAdDraft');
      if (draft) {
        const data = JSON.parse(draft);
        document.getElementById('campaign-name').value = data.campaignName || '';
        document.getElementById('buying-type').value = data.buyingType || 'auction';
        document.getElementById('spending-limit').value = data.spendingLimit || '';
        document.getElementById('campaign-objective').value = data.campaignObjective || '';
        document.getElementById('special-category').value = data.specialCategory || 'none';
        document.getElementById('budget-type').value = data.budgetType || 'daily';
        document.getElementById('budget-amount').value = data.budgetAmount || '';
        document.getElementById('start-date').value = data.startDate || '';
        document.getElementById('end-date').value = data.endDate || '';
        document.getElementById('locations').value = data.locations || '';
        document.getElementById('age-range').value = data.ageRange || '';
        document.getElementById('gender').value = data.gender || 'all';
        document.getElementById('detailed-targeting').value = data.detailedTargeting || '';
        document.getElementById('facebook-page').value = data.facebookPage || '';
        document.getElementById('instagram-account').value = data.instagramAccount || '';
        document.getElementById('ad-format').value = data.adFormat || 'single-image';
        document.getElementById('image-url').value = data.imageUrl || '';
        document.getElementById('primary-text').value = data.primaryText || '';
        document.getElementById('headline').value = data.headline || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('website-url').value = data.websiteUrl || '';
        document.getElementById('call-to-action').value = data.callToAction || 'learn-more';
        document.getElementById('student-name').value = data.studentName || '';
        document.getElementById('strategy-description').value = data.strategy || '';
        currentStep = data.currentStep !== undefined ? data.currentStep : 0;
        showStep(currentStep);
        updatePreview();
        alert('Draft loaded successfully!');
      }
    }
    window.onload = function() {
      if (localStorage.getItem('fbAdDraft')) {
        if (confirm('Load saved draft?')) {
          loadDraft();
        }
      }
    }

    // Update Performance Metrics based on Budget
    function updatePerformanceMetrics() {
      const budget = parseFloat(document.getElementById('budget-amount').value);
      const performanceSection = document.getElementById('performance-section');
      let estimatedReach = budget ? Math.round(budget * 50) : 0;
      let estimatedClicks = budget ? Math.round(budget * 5) : 0;
      let estimatedCostPerClick = budget && estimatedClicks ? (budget / estimatedClicks).toFixed(2) : 0;
      const metricsHTML = `
        <div><strong>Estimated Reach:</strong> ${estimatedReach} people</div>
        <div><strong>Estimated Clicks:</strong> ${estimatedClicks} clicks</div>
        <div><strong>Estimated CPC:</strong> $${estimatedCostPerClick}</div>
      `;
      document.getElementById('performance-metrics').innerHTML = metricsHTML;
      performanceSection.style.display = 'block';
    }

    // Tooltip Enhancement
    document.addEventListener('DOMContentLoaded', function() {
      const customTooltip = document.createElement('div');
      customTooltip.className = 'custom-tooltip';
      document.body.appendChild(customTooltip);
      const style = document.createElement('style');
      style.textContent = `
        .custom-tooltip {
          display: none;
          position: absolute;
          background: #333;
          color: white;
          padding: 10px;
          border-radius: 4px;
          z-index: 1000;
          max-width: 300px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          font-size: 14px;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
      const elementsWithTitle = document.querySelectorAll('[title]');
      elementsWithTitle.forEach(element => {
        const originalTitle = element.getAttribute('data-original-title') || element.title;
        element.setAttribute('data-original-title', originalTitle);
        element.removeAttribute('title');
        element.addEventListener('mouseenter', (e) => {
          customTooltip.textContent = originalTitle;
          customTooltip.style.display = 'block';
          const rect = e.target.getBoundingClientRect();
          customTooltip.style.top = (rect.bottom + window.scrollY + 10) + 'px';
          customTooltip.style.left = rect.left + 'px';
        });
        element.addEventListener('mouseleave', () => {
          customTooltip.style.display = 'none';
        });
      });
    });

    // Set minimum date for Start Date and update End Date accordingly
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('start-date').addEventListener('change', function() {
      document.getElementById('end-date').min = this.value;
    });
