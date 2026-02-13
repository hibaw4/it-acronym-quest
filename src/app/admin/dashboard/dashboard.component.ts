import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../core/services/data.service';
import { Acronym } from '../../core/models/acronym.interface';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  acronyms: Acronym[] = [];
  displayedColumns: string[] = ['abbreviation', 'fullTerm', 'category', 'actions'];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAcronyms();
  }

  loadAcronyms(): void {
    this.dataService.getAcronyms().subscribe(acronyms => {
      this.acronyms = acronyms;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addAcronym(result).subscribe(() => {
          this.snackBar.open('Acronym added successfully!', 'Close', { duration: 3000 });
          this.loadAcronyms();
        });
      }
    });
  }

  openEditDialog(acronym: Acronym): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '600px',
      data: acronym
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.updateAcronym(result).subscribe(() => {
          this.snackBar.open('Acronym updated successfully!', 'Close', { duration: 3000 });
          this.loadAcronyms();
        });
      }
    });
  }

  deleteAcronym(id: string): void {
    if (confirm('Are you sure you want to delete this acronym?')) {
      this.dataService.deleteAcronym(id).subscribe(() => {
        this.snackBar.open('Acronym deleted successfully!', 'Close', { duration: 3000 });
        this.loadAcronyms();
      });
    }
  }
}