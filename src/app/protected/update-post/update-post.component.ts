import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../common-service/common.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})

export class UpdatePostComponent implements OnInit {
  updatePostForm: FormGroup;
  StatusList = ['publish', 'future', 'draft', 'pending', 'private'];
  constructor(
    public dialogRef: MatDialogRef<UpdatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public commonService: CommonService,
    public snackBar: MatSnackBar) {
    console.log(data)
    this.loadForm();
  }
  loadForm() {
    this.updatePostForm = this.fb.group({
      title: [this.data.title.rendered, [Validators.required, Validators.maxLength(20)]],
      content: [this.data.content.rendered, [Validators.required, Validators.maxLength(250)]],
      status: [this.data.status, Validators.required]
    })
  }
  updatePost() {
    let item = {
      title: this.updatePostForm.controls['title'].value,
      content: this.updatePostForm.controls['content'].value,
      status: this.updatePostForm.controls['status'].value
    }
    console.log(item);
    this.commonService.updatePost(this.data.id, item)
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

  get f() { return this.updatePostForm.controls; }

  ngOnInit() {
  }

}
