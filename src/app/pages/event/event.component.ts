import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  product_id: string;

  constructor(private actRoute: ActivatedRoute) {
    this.product_id = this.actRoute.snapshot.params.id;
    console.log("Event View initialised");
  }

  ngOnInit(): void {
  }

}
