import { PartialType } from "@nestjs/mapped-types";
import { InstructorPayoutDto } from "./instructor-payout.dto";

export class insupdatePayoutDto extends PartialType(InstructorPayoutDto) {

}