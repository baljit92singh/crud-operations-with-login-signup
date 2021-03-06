import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../common-service/common.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent implements OnInit {
  createPostForm: FormGroup;
  StatusList = ['publish', 'future', 'draft', 'pending', 'private'];
  constructor(
    public dialogRef: MatDialogRef<CreatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public commonService: CommonService,
    public snackBar: MatSnackBar) {
    this.loadForm();
  }
  loadForm() {
    this.createPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      content: ['', [Validators.required, Validators.maxLength(250)]],
      status: ['', Validators.required]
    })
  }
  createPost() {
    let item = {
      title: this.createPostForm.controls['title'].value,
      content: this.createPostForm.controls['content'].value,
      status: this.createPostForm.controls['status'].value
    }
    console.log(item);
    this.commonService.createPost(item)
      .subscribe(res => this.successResponse(res),
        err => this.errorhandle(err)
      )
  }

  successResponse(data) {
    this.onNoClick(data)
  }

  errorhandle(error) {
    console.log(error.error.message)
    this.snackBar.open(error.error.message, 'Dismiss', { duration: 3000 });
  }

  onNoClick(data?): void {
    this.dialogRef.close(data);
  }

  onlyAlphanumeric(event: any) {
    const pattern = /[a-zA-Z0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  get f() { return this.createPostForm.controls; }

  ngOnInit() {
  }

}
