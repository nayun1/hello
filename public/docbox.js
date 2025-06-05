    // 'Select All' 
    document.getElementById('select-all').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.doc-checkbox:not(#select-all)');
        checkboxes.forEach(checkbox => {
          checkbox.checked = this.checked;
        });
      });