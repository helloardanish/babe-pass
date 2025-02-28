import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { CardModule } from 'primeng/card';
import {NgForOf, NgStyle} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import * as XLSX from 'xlsx';
import {ToastModule} from 'primeng/toast';


interface SiteDetail {
  name: string;
  url: string;
  category: string;
  tags: string[];
  username: string;
  email: string;
  password: string;
  showUsername: boolean;
  showEmail: boolean;
  showPassword: boolean;
  customFields: {
    key: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    NgForOf,
    NgStyle,
    Dialog,
    ToastModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [],
})
export class HomeComponent {

  colors = ['#FF5733', '#33A1FF', '#28B463', '#8E44AD', '#FFC300', '#E74C3C'];
  siteDetails: SiteDetail[] = [
    {name: 'We Work Remotely', url: 'https://weworkremotely.com/', category: '', tags: [], username: 'ardanish', email: 'helloardanish@gmail.com', password: '', showUsername: false, showEmail: false, showPassword: false, customFields: [{key:'', value: ''}]},
    {name: 'Hubstaff Talent', url: 'https://hubstafftalent.net/', category: '', tags: [], username: '', email: '', password: '', showUsername: false, showEmail: false, showPassword: false, customFields: [{key:'', value: ''}]},
    {name:'', url:'', category: '', username: '',  tags: [], email: '', password: '', showUsername: false, showEmail: false, showPassword: false, customFields: [{key:'', value: ''}]},
  ];

  loading: boolean = false;

  displayAddDialog = false;
  displayUpdateDialog = false;
  displayRemoveConfirmationDialog = false;
  displayUsernameDialog = false;
  displayEmailDialog = false;
  displayPasswordDialog = false;
  displayImportDialog = false;

  selectedSite: SiteDetail  = {
    name: '',
    url: '',
    category: '',
    tags: [],
    username: '',
    email: '',
    password: '',
    showUsername: false,
    showEmail: false,
    showPassword: false,
    customFields: [{key:'', value: ''}]
  };

  siteToRemoveIndex: number | null = null;
  newSite: SiteDetail = {
    name: '',
    url: '',
    category: '',
    tags: [],
    username: '',
    email: '',
    password: '',
    showUsername: false,
    showEmail: false,
    showPassword: false,
    customFields: [{key:'', value: ''}]
  };

  getRandomColor(index: number): string {
    const colors = ['#FFCC99', '#CCFFCC', '#99CCFF', '#FF99CC', '#CCCCFF'];
    return colors[index % colors.length];
  }

  // Open the import dialog
  openImportDialog(): void {
    this.displayImportDialog = true;
  }

  // Handle file input change for import
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as SiteDetail[];
        this.siteDetails = json.map((site) => ({
          ...site,
          showUsername: false,
          showEmail: false,
          showPassword: false
        }));
        this.displayImportDialog = false;
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Download data as Excel
  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.siteDetails);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Site Details');
    XLSX.writeFile(workbook, 'Site-Details.xlsx');
  }


  // Open the add dialog
  openAddDialog(): void {
    this.newSite = {name:'', url:'', category: '', tags: [], username: '', email: '', password: '', showUsername: false, showEmail: false, showPassword: false, customFields: [{key:'', value: ''}]}; // Reset the form
    this.displayAddDialog = true;
  }

  addSite() {
    this.loading = true;

    //
    // setTimeout(() => {
    //   this.loading = false
    // }, 2000);

    if(this.newSite.name=='' && this.newSite.url=='') {
      console.log(this.siteDetails);
    }
    // this.siteList.push(this.inputData);
    // Push a new object (copy) instead of a reference
    this.siteDetails.push({ ...this.newSite });
    console.log(this.siteDetails);
    this.clearInput();

    this.displayAddDialog = false;
  }

  clearInput() {
    this.newSite = {name: '', url: '', category: '', tags: [], username: '', email: '', password: '', showUsername: false, showEmail: false, showPassword: false, customFields: [{key:'', value: ''}]};
  }

  // Open the update dialog and set the selected site
  openUpdateDialog(site: SiteDetail): void {
    this.selectedSite = { ...site }; // Create a copy of the site to avoid direct mutation
    this.displayUpdateDialog = true;
  }

  // Update the site in the list
  updateSite(): void {
    const index = this.siteDetails.findIndex(site => site.name === this.selectedSite?.name);
    if (index !== -1) {
      this.siteDetails[index] = { ...this.selectedSite }; // Update the site
    }
    this.displayUpdateDialog = false; // Close the dialog
  }


  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // alert('Copied to clipboard!');
      console.log("copied to clipboard");
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  // Open the username dialog
  openUsernameDialog(site: any): void {
    this.selectedSite = site;
    this.displayUsernameDialog = true;
  }

  // Open the email dialog
  openEmailDialog(site: any): void {
    this.selectedSite = site;
    this.displayEmailDialog = true;
  }

  // Open the password dialog
  openPasswordDialog(site: any): void {
    this.selectedSite = site;
    this.displayPasswordDialog = true;
  }


  // Open the remove confirmation dialog
  openRemoveConfirmationDialog(index: number): void {
    this.siteToRemoveIndex = index;
    this.displayRemoveConfirmationDialog = true;
  }

  // Confirm removal of the site
  confirmRemove(): void {
    if (this.siteToRemoveIndex !== null) {
      this.siteDetails.splice(this.siteToRemoveIndex, 1);
      this.siteToRemoveIndex = null;
    }
    this.displayRemoveConfirmationDialog = false;
  }
}
