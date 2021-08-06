import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  Order,
  OrdersService,
  OrderStatus,
  ProductPhoto,
  ProductVariant,
  toZhMapper,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-orders-single',
  templateUrl: './orders-single.component.html',
  styleUrls: ['./orders-single.component.scss'],
})
export class OrdersSingleComponent implements OnInit {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  order: Order;
  orderStatusUpdateForm: FormGroup;

  currentStatusOptions: {
    value: OrderStatus;
    label: string;
    isDisabled: true | null;
  }[] = Object.keys(OrderStatus)
    .map((key) => (OrderStatus as unknown as any)[key])
    .map((status: OrderStatus) => ({
      value: status,
      label: toZhMapper(status, 'orderStatusWithEn'),
      isDisabled: null,
    }));

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  public productMainPhotoMapperFn(
    productPhotos: ProductPhoto[]
  ): ProductPhoto | undefined {
    return productPhotos.find((p) => p.isMain);
  }

  public productSkuMapperFn(
    productVariants: ProductVariant[]
  ): (variantValueId: number) => string | undefined {
    return (variantValueId: number) =>
      productVariants
        .find(
          (pv) =>
            pv.variantValues.find((vv) => vv.id === variantValueId) !==
            undefined
        )
        ?.variantValues.find((vv) => vv.id === variantValueId)?.sku;
  }

  ngOnInit(): void {
    this.initOrderStatusUpdateForm();

    const trackingNumberControl =
      this.orderStatusUpdateForm.get('trackingNumber');

    this.orderStatusUpdateForm
      .get('status')
      ?.valueChanges.subscribe((value: OrderStatus) => {
        if (value === OrderStatus.Shipped) {
          trackingNumberControl?.setValidators([
            Validators.required,
            Validators.minLength(8),
          ]);
        } else {
          trackingNumberControl?.setValidators([Validators.minLength(8)]);
        }
        trackingNumberControl?.updateValueAndValidity({ onlySelf: true });
      });

    this.route.paramMap
      .pipe(
        filter((params: ParamMap) => params.has('orderId')),
        switchMap((params: ParamMap) =>
          this.ordersService.getOrder(parseInt(params.get('orderId') as string))
        ),
        take(1)
      )
      .subscribe((order: Order) => {
        this.order = order;

        this.orderStatusUpdateForm.patchValue({
          ...order,
          status: order.currentStatus,
        });

        this.updateFormBasedOnOrderStatus(order);
      });
  }

  initOrderStatusUpdateForm(): void {
    this.orderStatusUpdateForm = this.fb.group({
      id: [null, [Validators.required]],
      status: [OrderStatus.Placed, [Validators.required]],
      trackingNumber: [null, [Validators.minLength(8)]],
      internalNotes: [null],
    });
  }

  updateFormBasedOnOrderStatus(order: Order): void {
    if (
      order.currentStatus === OrderStatus.Delivered ||
      order.currentStatus === OrderStatus.Canceled
    ) {
      this.orderStatusUpdateForm.disable();
    }

    if (order.currentStatus === OrderStatus.Shipped) {
      const placedOption = this.currentStatusOptions.find(
        (status) => status.value === OrderStatus.Placed
      );

      const cancelOption = this.currentStatusOptions.find(
        (status) => status.value === OrderStatus.Canceled
      );

      if (cancelOption !== undefined && placedOption !== undefined) {
        placedOption.isDisabled = true;
        cancelOption.isDisabled = true;
      }
    }
  }

  updateOrderStatus(): void {
    if (this.orderStatusUpdateForm.invalid) {
      this.clrForm.markAsTouched();
      this.orderStatusUpdateForm.markAllAsTouched();
      this.toastr.error('Order Status Update Failed', '訂單更新失敗');
      return;
    }

    this.ordersService
      .updateOrderStatus(this.orderStatusUpdateForm.value)
      .pipe(take(1))
      .subscribe((order: Order) => {
        this.order = order;
        this.updateFormBasedOnOrderStatus(order);
        this.toastr.success('Order Status Update Success', '訂單更新成功');
      });
  }
}
