package com.example.reactdemo.web.model.dto.scheduler;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ScheduleParamModelDto {

    private long userId;
    private String userAccountId;
}
