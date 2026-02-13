import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Acronym } from '../../core/models/acronym.interface';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
  standalone: false
})
export class ItemFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  categories = [
    'Software Development',
    'Networking',
    'Database',
    'Web Development',
    'Security',
    'Cloud Computing',
    'DevOps',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Acronym | null
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      id: [data?.id || ''],
      abbreviation: [data?.abbreviation || '', [Validators.required]],
      fullTerm: [data?.fullTerm || '', [Validators.required]],
      category: [data?.category || '', [Validators.required]],
      description: [data?.description || ''],
      logoUrl: [data?.logoUrl || '']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}